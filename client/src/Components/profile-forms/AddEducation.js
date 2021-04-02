import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addEducation } from "../../actions/profile";

const AddEducation = ({ addEducation, history }) => {
    const [formData, setFormData] = React.useState({
        school: "",
        degree: "",
        fieldofstudy: "",
        from: "",
        to: "",
        current: false,
        description: "",
    });

    const [toDateDisabled, toggleToDate] = React.useState(false);

    const { school, degree, fieldofstudy, from, to, current, description } = formData;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addEducation(formData, history);
    };

    return (
        <>
            <h1 className='large text-primary'>Add Your Education</h1>
            <p className='lead'>
                <i className='fas fa-graduation-cap'></i>
                Add any school, bootcamp, etc that you have attended
            </p>
            <small>Fields marked with * are required</small>
            <form className='form' onSubmit={handleSubmit}>
                <div className='form-group'>
                    <input
                        type='text'
                        placeholder='* School or Bootcamp'
                        name='school'
                        value={school}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        type='text'
                        placeholder='* Degree or Certificate'
                        name='degree'
                        value={degree}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        type='text'
                        placeholder='* Field Of Study'
                        name='fieldofstudy'
                        value={fieldofstudy}
                        onChange={handleChange}
                    />
                </div>
                <div className='form-group'>
                    <h4>From Date</h4>
                    <input type='date' name='from' value={from} onChange={handleChange} />
                </div>
                <div className='form-group'>
                    <p>
                        <input
                            type='checkbox'
                            name='current'
                            checked={current}
                            value={current}
                            onChange={(e) => {
                                setFormData({ ...formData, current: !current });
                                toggleToDate(!toDateDisabled);
                            }}
                        />{" "}
                        Current School or Bootcamp
                    </p>
                </div>
                <div className='form-group'>
                    <h4>To Date</h4>
                    <input
                        type='date'
                        name='to'
                        value={to}
                        onChange={handleChange}
                        disabled={toDateDisabled ? "disbaled" : ""}
                    />
                </div>
                <div className='form-group'>
                    <textarea
                        name='description'
                        cols='30'
                        rows='5'
                        placeholder='Program Description'
                        value={description}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <input type='submit' className='btn btn-primary my-1' />
                <Link className='btn btn-light my-1' to='/dashboard'>
                    Go Back
                </Link>
            </form>
        </>
    );
};

AddEducation.propTypes = {
    addEducation: PropTypes.func.isRequired,
};

export default connect(null, { addEducation })(withRouter(AddEducation));
