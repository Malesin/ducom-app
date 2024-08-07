const mongoose = require("mongoose")

const imageSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    imageBase64: String,
});

mongoose.model('ImageModel', imageSchema);