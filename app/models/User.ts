'use server';
import {models} from "mongoose";
import {model} from "mongoose";
import {Schema} from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },  
});

const User = models.User || model("User", userSchema);

export default User;