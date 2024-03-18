const RatingAndReview = require('../models/RatingAndReview');
const Course = require('../models/Course');
const { default: mongoose } = require('mongoose');

//HW: DONE: Create Rating  , getAvgRating and getAllRating
exports.createRating = async(req, res)=>{
    try{
        //pr rating pe toh koi limit nhi ddal rkhi ki 5 tak hi de skte hai woh front end main dalenge kya?

        const {courseId , rating  , review} = req.body;
        const userId = req.user.id;

        if(!courseId || !rating || !review){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        //check if user is enrolled in the course or not
        const courseDetails = await Course.findOne({_id: courseId , studentsEnrolled: {$elematch:{$eq: userId}}});

        if(!courseDetails){
            return res.status(404).json({
                success: false , 
                message: "Student is not enrolled in this course",
            });
        }

        //check if user already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId, //agar in dono ke sath koi bhi value pdi hai iska matlab user has already reviewed
        });
        
        if(alreadyReviewed){
            return res.status(403).json({
                success: false,
                message: "Course is already reviewed by the user",
            });
        }

        ratingDetails = await RatingAndReview.create({user: userId , rating , review , course:courseId});

        //HW: idhr se return 200 tak koi glti hai ya nhi
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId , {$push:{ratingAndReview: ratingDetails._id}} , {new: true});
        console.log(updatedCourseDetails);

        return res.status(200).json({
            success: true , 
            message: "Review created successfully",
            ratingDetails,
        });
        
    } catch(error){
        return res.status(500).json({
            success: false , 
            message: "Something went wrong while creating the review",
            error: error.message,
        });
    }
}

exports.getAverageRating  = async(req, res)=>{
    try{
        const {courseId} = req.body; //HW: find out what is aggregate
        const result = await RatingAndReview.aggregate([
            {   
                //why mongoose.Types.ObjectId showing deprecated
                $match:{
                    course: new mongoose.ObjectId(courseId), //rating and review ke andar aisi entry dhunke do jismain match kr rhi hai yeh courseId
                }, //yeh kiya taki iss course ke liye jitne review hai woh ajaye
            },
            {
                $group:{ //kis basis pe group krna chahte hai jab pta nhi hota kis basis pr group kre tab id null mark krdete hai
                    _id: null, //jitni bhi entries uss courseId ke liye ayi thi usse ek single grp main wrap krdiya _id: null likhke , agar id ki kuch value dete jiske basis pr grp bnane hai toh uss basis pr different grps bnjate
                    averageRating:  {$avg:"$rating"}, //avg rating calculate krdiya
                    //search about these thing avg , match etc
                }
            }
        ]);

        if(result.length>0){
            return res.status(200).json({
                success: true , 
                averageRating: result[0].averageRating, //aggregate function array return kr rha hai toh value jo calculate kri thi average rating ki woh 0th index pe store hogi
                //0th index pe kyun kaise store hui? kyunki iss case main ek hi value mil rhi hai pura operation jo uper kra hai aggregate main uske baad isliye woh zeroth index pe pdi hai toh nikal liya usse
            });
        }
        
        //if no review rating exist
        return res.status(200).json({
            success: true , 
            message: "Averag rating is 0 , no ratings given till now",
            averageRating: 0,
        });

    } catch(error){
        return res.status(500).json({
            success: false , 
            message: "Something went wrong while getting average rating",
            error: error.message,
        });
    }
}

//gets all rating reviews from all courses but why we need this? taki har course se review phir home page pe dikha skte hai like on codehelp
exports.getAllRating  = async(req, res)=>{
    try{                                                                        //rating main descending order main sort hokr data ayega aur select matlab user main se sirf yeh lakr dena 
        const ratingsAndReviews = await RatingAndReview.find({}).sort({rating: "desc"}).populate({path: 'user' , select:"firstName lastName email image"}).populate({path: "course" , select: "courseName",}).exec();

        return res.status(200).json({
            success: true , 
            message: "Successfully fetched all reviews",
            data: ratingsAndReviews,
        });

    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Something went wrong while getting all ratings",
            error: error.message,
        });
    }
}

//update krna ho review toh? uske liye update wala handler add krna pdega aur front end pe edit button