const Course = require('../models/Course');
const Category = require('../models/Categories');
const User = require('../models/User');
const {uploadImageToCloudinary} = require('../utils/imageUploader');

//create course handler function
exports.createCourse = async(req , res)=>{
    try{

        //yeh log in hone ke baad hi create kr skte hai course toh id agar chahiye user ki toh id toh req main middleware main add krdiya tha req.user = decode 
        const {courseName , courseDescription , whatYouWillLearn , price , category} = req.body;
        const thumbnail = req.files.thumbnailImage;

        //validation
        if(!courseName || ! courseDescription || !whatYouWillLearn || !price || !category || !thumbnail){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        //check for instructor kyunki hume instructor ki id ki zarorat hai hia course ke model main store krane ke liye 
        const userId = req.user.id;
//      const instructorDetails = await User.findById(userId); //HW: verify that userId and instructor._id is same or not kyunki phir toh yeh teen line ki zarurat nhi instructor ki id nikalne ke liye
//        console.log("Instrcutor Details: ",instructorDetails);  //isliye instructor._id ke jagah har jagah userId daldiya     
        //zaruri hai yeh commented out validations krna manlo koi middleware ko bypass krke directly idhr aagya phir
        // if(!instructorDetails){
        //     return res.status(404).json({
        //         success: false,
        //         message: "Instructor Details not found",
        //     });
        //  }

        //check given tag is valid or not ,iski bhi zarurat nhi hai shyd kyunki tag ki id ayi hai req main tag tag ki id hai aur tag valid hi ayega front end se kyunki option diya hai available tags main se choose krne ka..., confirm this?
        const categoryDetails = await Category.findById(category); //course main tag referenced hai toh req ki body main jo tag ayaa hoga woh id hogi
        if(!categoryDetails){
            return res.status(404).json({
                success: false,
                message: "Category Details not found",
            });
        }

        //upload img to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: userId,
            whatYouWillLearn,
            price,
            Category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
        });

        //instructor ki course list update
        await User.findByIdAndUpdate({_id:userId} , {$push:{courses: newCourse._id}} , {new: true});

        //HW: update tag Schema
        await Category.findByIdAndUpdate({_id: category} , {$push:{course: newCourse._id}} , {new: true});

        return res.status(200).json({
            success: true,
            message: "Course Created Successfully",
            data: newCourse,
        });

    } catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message,
        });
    }
}

//getAllCourses
exports.showAllCourses = async(req , res)=>{
    try{

        const allCourses = await Course.find({} , {courseName: true , price:true , thumbnail: true , instructor: true , ratingAndReview: true , studentsEnrolled: true}).populate("instructor").exec(); //default value students enrolled ki toh hai hi nhi , aur na hi ratingAndReview ki toh unhe true kyun mark kr rhe hai manlo kisi ne bhi na dala ho review fir toh course main rating hoga hi nhi phir fetch nhi ho payega??

        return res.status(200).json({
            success: true,
            message: "Data for all courses fetched successfully",
            data: allCourses,
        });

    } catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Cannot fetch course data",
            error: error.message,
        });
    }
}

//HW: getCourseDetais populate krake entire course detail deni hai ek course ke liye ek bhi objectId nhi hona chahiye sab populated
exports.getCourseDetails = async(req , res)=>{
    try{    

        const {courseId} = req.body;

        if(!courseId){
            return res.status(400).json({
                success: false ,
                message: "Course ID is missing",
            });
        }

        const courseDetails = await Course.findById(courseId)
                                          .populate({
                                            path: "instructor",
                                            populate:{
                                                path: 'additionalDetails'
                                            },
                                          }).populate({
                                            path: 'courseContent',
                                            populate:{
                                                path: 'subSection',
                                            },
                                          }).populate('ratingAndReview')
                                          .populate('category')
                                          .populate('studentsEnrolled')
                                          .exec();
        
        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: `Could not find the course with ${courseId}`,
            });
        }

        return res.status(200).json({
            success: true , 
            message: "Fetched all course details successfully",
            data: courseDetails,

        });

    } catch(error){
        return res.status(500).json({
            success: false , 
            message: "An error occured while fetching course details",
            error: error.message,
        });
    }
}