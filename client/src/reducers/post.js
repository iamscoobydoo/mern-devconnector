import * as ALERT from "../actions/types";

const initialState = {
    post: null,
    posts: [],
    loading: true,
    error: {},
};

export default function postReducer(state = initialState, action) {
    const { payload, type } = action;
    switch (type) {
        case ALERT.GET_POSTS:
            return {
                ...state,
                posts: payload,
                loading: false,
            };
        case ALERT.GET_POST:
            return {
                ...state,
                post: payload,
                loading: false,
            };
        case ALERT.ADD_POST:
            return {
                ...state,
                posts: [payload, ...state.posts],
                loading: false,
            };
        case ALERT.UPDATE_LIKES:
            return {
                ...state,
                posts: state.posts.map((post) =>
                    post._id === payload.postId ? { ...post, likes: payload.likes } : post
                ),
                loading: false,
            };
        case ALERT.ADD_COMMENT:
            return {
                ...state,
                post: { ...state.post, comments: payload },
                loading: false,
            };
        case ALERT.REMOVE_COMMENT:
            return {
                ...state,
                post: {
                    ...state.post,
                    comments: state.post.comments.filter((comment) => comment._id !== payload),
                },
                loading: false,
            };
        case ALERT.DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter((post) => post._id !== payload),
                loading: false,
            };
        case ALERT.POST_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
            };
        default:
            return state;
    }
}
