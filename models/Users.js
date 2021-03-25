import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    avatar: {
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    }
});

export default User = model('user', userSchema);