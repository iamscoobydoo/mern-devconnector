const express = require("express");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Post = require("../../models/Post");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const router = express.Router();

//@route    POST api/posts
//@desc     Create a post
//@access   Private
router.post(
    "/",
    [auth, [check("text", "Text is required").not().isEmpty()]],
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select("-password");

            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
            });

            const post = await newPost.save();
            return res.json(post);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Internal Server error");
        }
    }
);

//@route    GET api/posts
//@desc     Get all posts
//@access   Private
router.get("/", auth, async function (req, res) {
    try {
        const posts = await Post.find().sort({ date: "desc" });
        return res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
});

//@route    GET api/posts/:post_id
//@desc     Get post by id
//@access   Private
router.get("/:post_id", auth, async function (req, res) {
    try {
        const post = await Post.findById(req.params.post_id);

        if (!post) return res.status(404).json({ msg: "Post not found" });

        return res.json(post);
    } catch (err) {
        console.error(err.message);

        if (err.kind == "ObjectId")
            return res.status(400).json({ msg: "Post not found" });

        res.status(500).send("Internal Server Error");
    }
});

//@route    DELETE api/posts/:post_id
//@desc     Delete a post
//@access   Private
router.delete("/:post_id", auth, async function (req, res) {
    try {
        const post = await Post.findById(req.params.post_id);

        if (!post) return res.status(404).json({ msg: "Post not found" });

        //check if comment is made by logged in user
        if (post.user.toString() !== req.user.id)
            return res.status(401).json({ msg: "User not authorised" });

        await post.remove();
        return res.json({ msg: "Post removed successfully" });
    } catch (err) {
        console.error(err.message);

        if (err.kind == "ObjectId")
            return res.status(400).json({ msg: "Post not found" });

        res.status(500).send("Internal Server Error");
    }
});

//@route    PUT api/posts/like/:post_id
//@desc     Like a post
//@access   Private
router.put("/like/:post_id", auth, async function (req, res) {
    try {
        const post = await Post.findById(req.params.post_id);

        //check if user already liked this post
        if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
                .length > 0
        ) {
            return res.status(400).json({ msg: "Post already liked by user" });
        }

        post.likes.unshift({ user: req.user.id });
        await post.save();
        return res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Internal Server error");
    }
});

//@route    PUT api/posts/unlike/:post_id
//@desc     Unlike a post
//@access   Private
router.put("/unlike/:post_id", auth, async function (req, res) {
    try {
        const post = await Post.findById(req.params.post_id);

        //check if user already liked this post
        if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
                .length === 0
        ) {
            return res.status(400).json({ msg: "Post not liked by user" });
        }

        //get remove index
        const removeIndex = post.likes
            .map((like) => like.user.toString())
            .indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);

        await post.save();
        return res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Internal Server error");
    }
});

//@route    POST api/posts/comment/:post_id
//@desc     Comment on a post
//@access   Private
router.post(
    "/comment/:post_id",
    [auth, [check("text", "Text is required").not().isEmpty()]],
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select("-password");
            const post = await Post.findById(req.params.post_id);

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
            };

            post.comments.unshift(newComment);
            post.save();
            return res.json(post.comments);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Internal Server error");
        }
    }
);

//@route    DELETE api/posts/comment/:post_id/:comment_id
//@desc     delete a comment on a post
//@access   Private
router.delete("/comment/:post_id/:comment_id", auth, async function (req, res) {
    try {
        const post = await Post.findById(req.params.post_id);
        if (!post) {
            return res.status(404).json({ msg: "Post does not exist" });
        }

        //retrieve the comment from the post
        const comment = post.comments.find(
            (comment) => comment.id === req.params.comment_id
        );

        //check if comment exists
        if (!comment)
            return res.status(404).json({ msg: "Comment does not exist" });

        //check if comment was made by logged in user
        if (comment.user.toString() !== req.user.id)
            return res.status(401).json({ msg: "User not authorised" });

        //get remove index
        const removeIndex = post.comments
            .map((comment) => comment.user.toString())
            .indexOf(req.params.comment_id);

        post.comments.splice(removeIndex, 1);

        await post.save();
        return res.json(post.comments);
    } catch (err) {
        console.error(err.message);

        if (err.kind == "ObjectId")
            return res.status(400).json({ msg: "Post not found" });

        return res.status(500).send("Internal Server error");
    }
});

module.exports = router;
