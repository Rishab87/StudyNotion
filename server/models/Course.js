const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
        trim: true,
        required: true,
    },
    courseDescription:{
        type: String,
        required: true,
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    whatYouWillLearn:{
        type:String,
    },
    courseContent:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Section",
                required:true,
            }
    ],
    ratingAndReview:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReview"
        }
    ],
    price:{ 
        type: Number,
        required:true,
    },
    thumbnail:{
        type:String,
        required: true,
    },
    tag:{
        type: [String],
        required:true,
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    studentsEnrolled:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    ],
    instructions: {
		type: [String], //notation [String] indicates an array of strings.
	},
	status: {
		type: String,
		enum: ["Draft", "Published"],
	},
    createdAt:{
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Course" , courseSchema);