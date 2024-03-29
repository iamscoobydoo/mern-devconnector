require("dotenv").config({ path: "../.env" });
const express = require("express");
const { check, validationResult } = require("express-validator");
const request = require("request");
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");

const router = express.Router();

//@route    GET api/profile/me
//@desc     Get current user's profile
//@access   Private
router.get("/me", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id,
        }).populate("user", ["name", "avatar"]);

        if (!profile) {
            return res.status(400).json({ msg: "There is no profile for this user" });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
});

//@route    POST api/profile
//@desc     Create or update user profile
//@access   Private
router.post(
    "/",
    [
        auth,
        [
            check("status", "Status is required").not().isEmpty(),
            check("skills", "Skills is required").not().isEmpty(),
        ],
    ],
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            company,
            website,
            location,
            bio,
            status,
            skills,
            githubusername,
            youtube,
            twitter,
            facebook,
            linkedin,
            instagram,
        } = req.body;

        //Build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = Array.isArray(skills)
                ? skills
                : skills.split(",").map((skill) => skill.trim());
        }
        //Build social
        profileFields.social = {};
        if (youtube) {
            if (youtube.includes("http://") || youtube.includes("https://"))
                profileFields.social.youtube = youtube;
            else profileFields.social.youtube = `https://${youtube}`;
        }
        if (twitter) {
            if (twitter.includes("http://") || twitter.includes("https://"))
                profileFields.social.twitter = twitter;
            else profileFields.social.twitter = `https://${twitter}`;
        }
        if (facebook) {
            if (facebook.includes("http://") || facebook.includes("https://"))
                profileFields.social.facebook = facebook;
            else profileFields.social.facebook = `https://${facebook}`;
        }
        if (linkedin) {
            if (linkedin.includes("http://") || linkedin.includes("https://"))
                profileFields.social.linkedin = linkedin;
            else profileFields.social.linkedin = `https://${linkedin}`;
        }
        if (instagram) {
            if (instagram.includes("http://") || instagram.includes("https://"))
                profileFields.social.instagram = instagram;
            else profileFields.social.instagram = `https://${instagram}`;
        }

        try {
            let profile = await Profile.findOne({ user: req.user.id });
            if (profile) {
                //Update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );
                return res.json(profile);
            }

            //Create
            profile = new Profile(profileFields);
            await profile.save();
            return res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Internal Server error");
        }
    }
);

//@route    GET api/profile
//@desc     Get all profiles
//@access   Public
router.get("/", async function (req, res) {
    try {
        const profiles = await Profile.find().populate("user", ["name", "avatar"]);
        return res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
});

//@route    GET api/profile/user/:user_id
//@desc     Get profile by user ID
//@access   Public
router.get("/user/:user_id", async function (req, res) {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id,
        }).populate("user", ["name", "avatar"]);

        if (!profile) return res.status(400).json({ msg: "Profile not found" });
        return res.json(profile);
    } catch (err) {
        if (err.kind === "ObjectId") return res.status(400).json({ msg: "Profile not found" });
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
});

//@route    DELETE api/profile
//@desc     Delete profile, user and posts
//@access   Private
router.delete("/", auth, async function (req, res) {
    try {
        await Post.deleteMany({ user: req.user.id }); //delete all user posts
        await Profile.findOneAndRemove({ user: req.user.id }); //Remove profile
        await User.findOneAndRemove({ _id: req.user.id }); //Remove User
        return res.json({ msg: "User deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
});

//@route    PUT api/profile/experience
//@desc     Add profile experience
//@access   Private
router.put(
    "/experience",
    [
        auth,
        [
            check("title", "Title is required").not().isEmpty(),
            check("company", "Company is required").not().isEmpty(),
            check("from", "From date is required").not().isEmpty(),
        ],
    ],
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, company, location, from, to, current, description } = req.body;

        const newExperience = {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.experience.unshift(newExperience);
            await profile.save();
            return res.json(profile);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Internal Server error");
        }
    }
);

//@route    DELETE api/profile/expreience/:exp_id
//@desc     Delete profile experience
//@access   Private
router.delete("/experience/:exp_id", auth, async function (req, res) {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        //get the remove index
        const removeIndex = profile.experience.map((item) => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        return res.json(profile);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Internal Server error");
    }
});

//@route    PUT api/profile/education
//@desc     Add education to profile
//@access   Private
router.put(
    "/education",
    [
        auth,
        [
            check("school", "School is required").not().isEmpty(),
            check("degree", "Degree is required").not().isEmpty(),
            check("fieldofstudy", "Field of study is required").not().isEmpty(),
            check("from", "From date is required").not().isEmpty(),
        ],
    ],
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { school, degree, fieldofstudy, from, to, current, description } = req.body;

        const newEducation = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.education.unshift(newEducation);
            await profile.save();
            return res.json(profile);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Internal Server error");
        }
    }
);

//@route    DELETE api/profile/education/:edu_id
//@desc     Delete education from profile
//@access   Private
router.delete("/education/:edu_id", auth, async function (req, res) {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        //get the remove index
        const removeIndex = profile.education.map((item) => item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1);
        await profile.save();
        return res.json(profile);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Internal Server error");
    }
});

//@route    GET api/profile/github/:username
//@desc     Get repos from user's github repo
//@access   Public
router.get("/github/:githubusername", async function (req, res) {
    try {
        const options = {
            uri: ` https://api.github.com/users/${req.params.githubusername}/repos?per_page=5&sort=created:desc&client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`,
            method: "GET",
            headers: { "user-agent": "node.js" },
        };
        request(options, function (error, response, body) {
            if (error) console.error(error);
            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: "No Github profile found" });
            }
            return res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Internal Server error");
    }
});

module.exports = router;
