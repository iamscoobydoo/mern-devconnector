import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Loading from "../layout/Loading";
import DashboardActions from "./DashboardActions";
import { getCurrentProfile } from "../../actions/profile";

const Dashboard = ({ getCurrentProfile, auth: { user }, profile: { profile, loading } }) => {
    React.useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile]);

    return loading && profile === null ? (
        <Loading />
    ) : (
        <>
            <h1 className='large text-primary'>Dashboard</h1>
            <p className='lead'>
                <i className='fas fa-user'></i> Welcome {user && user.name}
            </p>
            {profile !== null ? (
                <DashboardActions />
            ) : (
                <>
                    <p>You have not yet set up a profile. Please add your info</p>
                    <Link to='/create-profile' className='btn btn-primary my-1'>
                        {" "}
                        Setup Profile
                    </Link>
                </>
            )}
        </>
    );
};

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
