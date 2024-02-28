const mongoose = require("mongoose");
//ache se dimag lgakr sochlo kya banana hai pura design krlo code krne main bohot kam time lgega
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
    //sections ka reference courseContent ke name se hai
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
    price:{ //jidhr req true kra hai udhr phir shyd front end main bhi woh fields required krni pde uska dhyan rkhe
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
});

module.exports = mongoose.model("Course" , courseSchema);