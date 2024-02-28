const mongoose = require("mongoose");


const ratingAndReview = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    rating:{
        type: Number,
        required:true,
    },
    review:{
        type:String,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Course",
        index: true , 
    }
    //The index: true option in a Mongoose model schema tells Mongoose to create an index on the specified field. Indexes are data structures that can significantly improve query performance by allowing the database to quickly find and retrieve data that matches specific criteria.
    //For example, if you have a User model with a name field, you could create an index on the name field to improve the performance of queries that filter or sort by the name field.

});

module.exports = mongoose.model("RatingAndReview" , ratingAndReview);