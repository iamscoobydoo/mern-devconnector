import React from "react";
import Moment from "react-moment";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const Experience = ({ experience }) => {
    return (
        <>
            <h2 className='my-2'>Experience Credentials</h2>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Company</th>
                        <th className='hide-sm'>Title</th>
                        <th className='hide-sm'>Years (MM/DD/YYYY)</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {experience.map((exp) => (
                        <tr key={exp._id}>
                            <td>{exp.company}</td>
                            <td className='hide-sm'>{exp.title}</td>
                            <td className='hide-sm'>
                                <Moment format='DD/MM/YYYY'>{exp.from}</Moment> -{" "}
                                {exp.to === null ? (
                                    "Now"
                                ) : (
                                    <Moment format='DD/MM/YYYY'>{exp.to}</Moment>
                                )}
                            </td>
                            <td>
                                <button className='btn btn-danger'>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

Experience.propTypes = {
    experiences: PropTypes.array.isRequired,
};

export default connect()(Experience);
