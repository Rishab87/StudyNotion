const mongoose = require("mongoose");

const subSectionSchema = new mongoose.Schema({
    title:{
        type: String,
    },
    description:{
        type: String,
    },
    videoUrl:{
        type: String,
    },
    // totalDuration:{
    //     type: String,
    // }add this
});

module.exports = mongoose.model("SubSection" , subSectionSchema);