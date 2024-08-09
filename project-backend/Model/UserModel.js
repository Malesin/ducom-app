const mongoose = require("mongoose")

const UserDetailSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email:
    {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        default: null
    },
    photo_profile: {
        type: String,
        default: null
    },
    join_date: {
        type: Date,
        default: Date.now
    }
}, {
    collection: "UserModel"
})

mongoose.model("UserModel", UserDetailSchema)