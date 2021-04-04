import React from "react";
import PropTypes from "prop-types";

const ProfileAbout = ({ profile }) => {
    const {
        skills,
        bio,
        user: { name },
    } = profile;
    return (
        <>
            <div class='profile-about bg-light p-2'>
                {bio && (
                    <>
                        <h2 className='text-primary'>
                            {name.trim().split(" ")[0][name.trim().split(" ")[0].substring(-1)] ===
                            "s" ? (
                                <span> {name.trim().split(" ")[0]}' Bio </span>
                            ) : (
                                <span>{name.trim().split(" ")[0]}'s Bio</span>
                            )}
                        </h2>
                        <p>{bio}</p>
                        <div class='line'></div>
                    </>
                )}
                <h2 class='text-primary'>Skill Set</h2>
                <div class='skills'>
                    {skills.map((skill, index) => (
                        <div key={index} class='p-1'>
                            <i class='fa fa-check'></i> {skill}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

ProfileAbout.propTypes = {
    profile: PropTypes.object.isRequired,
};

export default ProfileAbout;
