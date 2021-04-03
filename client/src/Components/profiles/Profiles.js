import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Loading from "../layout/Loading";
import ProfileItem from "./ProfileItem";
import { getAllProfiles } from "../../actions/profile";

const Profiles = ({ getAllProfiles, profile: { profiles, loading } }) => {
    React.useEffect(() => {
        getAllProfiles();
    }, [getAllProfiles]);

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <h1 className='large text-primary'>Developers</h1>
                    <p className='lead'>
                        <i className='fab fa-connectdevelop'></i> Browse and connect with developers
                    </p>
                    <div className='profiles'>
                        {profiles.length > 0 ? (
                            profiles.map((profile) => (
                                <ProfileItem key={profile._id} profile={profile} />
                            ))
                        ) : (
                            <h4>No Profiles Found...</h4>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

Profiles.propTypes = {
    getAllProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    profile: state.profile,
});

export default connect(mapStateToProps, { getAllProfiles })(Profiles);
