import axios from "axios";
import { setAlert } from "./alert";
import * as ALERT from "./types";

//get all posts
export const getAllPosts = () => async (dispatch) => {
    try {
        const res = await axios.get("/api/posts");
        dispatch({
            type: ALERT.GET_POSTS,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: ALERT.POST_ERROR,
            payload: { status: err.response.status, msg: err.response.statusText },
        });
    }
};

//like a post
export const addLike = (postId) => async (dispatch) => {
    try {
        const res = await axios.put(`/api/posts/like/${postId}`);
        dispatch({
            type: ALERT.UPDATE_LIKES,
            payload: { postId, likes: res.data },
        });
    } catch (err) {
        dispatch({
            type: ALERT.POST_ERROR,
            payload: { status: err.response.status, msg: err.response.statusText },
        });
    }
};

//unlike a post
export const removeLike = (postId) => async (dispatch) => {
    try {
        const res = await axios.put(`/api/posts/unlike/${postId}`);
        dispatch({
            type: ALERT.UPDATE_LIKES,
            payload: { postId, likes: res.data },
        });
    } catch (err) {
        dispatch({
            type: ALERT.POST_ERROR,
            payload: { status: err.response.status, msg: err.response.statusText },
        });
    }
};

//add a post
export const addPost = (formData) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    try {
        const res = await axios.post("/api/posts", formData, config);
        dispatch({
            type: ALERT.ADD_POST,
            payload: res.data,
        });

        dispatch(setAlert("Post Created", "success"));
    } catch (err) {
        console.log(err);
        dispatch({
            type: ALERT.POST_ERROR,
            payload: { status: err.response.status, msg: err.response.statusText },
        });
    }
};

//delete a post
export const deletePost = (postId) => async (dispatch) => {
    try {
        await axios.delete(`/api/posts/${postId}`);
        dispatch({
            type: ALERT.DELETE_POST,
            payload: postId,
        });

        dispatch(setAlert("Post Removed", "success"));
    } catch (err) {
        dispatch({
            type: ALERT.POST_ERROR,
            payload: { status: err.response.status, msg: err.response.statusText },
        });
    }
};
