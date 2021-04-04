import React from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";

const ProfileEducation = ({ education }) => {
    return (
        <>
            <div className='profile-edu bg-white p-2'>
                <h2 className='text-primary'>Education</h2>
                {education.length > 0 ? (
                    <>
                        {education.map((edu) => (
                            <div key={edu._id}>
                                <h3 className='text-dark'>{edu.school}</h3>
                                <p>
                                    <Moment format='DD/MM/YYYY'>{edu.from}</Moment> -{" "}
                                    {edu.to === null ? (
                                        "Now"
                                    ) : (
                                        <Moment format='DD/MM/YYYY'>{edu.to}</Moment>
                                    )}
                                </p>
                                <p>
                                    <strong>Degree: </strong>
                                    {edu.degree}
                                </p>
                                <p>
                                    <strong>Field of study: </strong>
                                    {edu.fieldofstudy}
                                </p>
                                {edu.description && (
                                    <p>
                                        <strong>Description: </strong>
                                        {edu.description}{" "}
                                    </p>
                                )}
                            </div>
                        ))}
                    </>
                ) : (
                    <h4>No education credentials</h4>
                )}
            </div>
        </>
    );
};

ProfileEducation.propTypes = {
    education: PropTypes.array.isRequired,
};

export default ProfileEducation;
