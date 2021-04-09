import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import PostForm from "./PostForm";
import PostItem from "./PostItem";
import Loading from "../layout/Loading";
import { getAllPosts } from "../../actions/post";

const Posts = ({ getAllPosts, post: { posts, loading } }) => {
    React.useEffect(() => {
        getAllPosts();
    }, [getAllPosts]);

    return loading ? (
        <Loading />
    ) : (
        <>
            <h1 className='large text-primary'>Posts</h1>
            <p className='lead'>
                <i className='fas fa-user'></i>Welcome to the community
            </p>
            <PostForm />
            <div className='posts'>
                {posts.map((post) => (
                    <PostItem key={post._id} post={post} />
                ))}
            </div>
        </>
    );
};

Posts.propTypes = {
    getAllPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    post: state.post,
});

export default connect(mapStateToProps, { getAllPosts })(Posts);
