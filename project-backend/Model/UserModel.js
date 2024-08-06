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
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    photo_profile: {
        type: String
    }
}, {
    collection: "UserModel"
})

mongoose.model("UserModel", UserDetailSchema)