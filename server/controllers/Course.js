const Course = require('../models/Course');
const Category = require('../models/Categories');
const User = require('../models/User');
const {uploadImageToCloudinary} = require('../utils/imageUploader');
const { mediaDeleter } = require('../utils/mediaDeleter');
const convertSecondsToDuration = require('../utils/secToDuration');
const CourseProgress = require('../models/CourseProgress')

//create course handler function
exports.createCourse = async(req , res)=>{
    try{

        //yeh log in hone ke baad hi create kr skte hai course toh id agar chahiye user ki toh id toh req main middleware main add krdiya tha req.user = decode 
        const {courseName , courseDescription , whatYouWillLearn , price , category , tag =[]} = req.body;
        const thumbnail = req.files.thumbnailImage;
        //tag optional krdiya hai
        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail){
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
        console.log(categoryDetails);
        //create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: userId,
            whatYouWillLearn,
            price,
            tag,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
            status: "Draft",
        });
        console.log(newCourse);

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

        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
          content.subSection.forEach((subSec) => {
            const timeDurationInSeconds = parseInt(subSec.totalDuration)
            totalDurationInSeconds += timeDurationInSeconds
          })
        });
    
        const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

        let courseProgressCount = await CourseProgress.findOne({
            courseID: courseId,
            userId: req.user.id,
        }).populate('completedVideos').exec();

        

        return res.status(200).json({
            success: true , 
            message: "Fetched all course details successfully",
            data: courseDetails,
            totalDuration,
            courseProgressCount: courseProgressCount?.completedVideos || [],
        });

    } catch(error){
        return res.status(500).json({
            success: false , 
            message: "An error occured while fetching course details",
            error: error.message,
        });
    }
}

exports.editCourse = async(req , res)=>{
    try{
        const {courseId} = req.body;

        const course = await Course.findById(courseId).populate('category').exec();
        
        //add edit image code
        const {courseName = course.courseName , courseDescription =course.courseDescription , price = course.price , whatYouWillLearn = course.whatYouWillLearn , category =course.category._id , instructions =course.instructions , status = course.status} = req.body;

        const updatedCourse = await Course.findByIdAndUpdate({_id: courseId} , {
            courseName , 
            courseDescription , 
            price,
            whatYouWillLearn , 
            category,
            instructions , 
            status
        });

        if(status === "Published"){
            await Category.findByIdAndUpdate({_id: category} , {$push:{courses: courseId}} , {new: true});
        }

        return res.status(200).json({
            success: true , 
            message: "Course updated successfully",
            updatedCourse,
        });

    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Something went wrong while editing the course",
            error: error.message,
        });
    }
}

//get instructor course add it\
exports.getInstructorCourses = async(req , res)=>{
    try{
        const instructorId = req.user.id;

        const instructorCourses = await Course.find({
            instructor: instructorId , 
        }).sort({createdAt: -1}).populate({
            path: 'courseContent',
            populate:{
                path: 'subSection',
            },
          });

        res.status(200).json({
            success: true,
            data: instructorCourses,
        });

    } catch(error){
        res.status(500).json({
            success: false,
            message: "Failed to retrieve instructor courses",
            error: error.message,
        });
    }
}

exports.deleteCourse = async(req , res)=>{
    try{
        const {courseId} = req.body;
        const userId = req.user.id;

        const deletedCourse = await Course.findByIdAndDelete(courseId).populate({
            path: 'courseContent',
            populate:{
                path: 'subSection',
            }
        });

        await User.findByIdAndUpdate({_id: userId} , {$pull:{courses: courseId}} , {new: true});

        if(!deletedCourse){
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        await deletedCourse.courseContent.forEach((section)=>{
            section.subSection.forEach((subSec)=>{
                mediaDeleter(subSec.videoUrl.split('/').pop().split('.')[0]);
            })
        });

        await mediaDeleter(deletedCourse.thumbnail.split('/').pop().split('.')[0]);

        return res.status(200).json({
            success: true,
            message: "Course Deleted successfully",
        });

        //do we need to delete section and subSection sepereatley
        //yes
        //unenroll students from the course
        
    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the course",
            error: error.message,
        });
    }
}

exports.markLectureAsComplete = async(req , res)=>{
    try{

        const {courseId , subSectionId} = req.body;
 
        if(!courseId || !subSectionId){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const courseProgress = await CourseProgress.findOneAndUpdate({
            courseID: courseId,
            userId: req.user.id,
        } , {$push:{completedVideos: subSectionId}} , {new:true});

        if(!courseProgress){
            const newCourseProgress = await CourseProgress.create({
                courseID: courseId,
                userId: req.user.id,
                completedVideos: [subSectionId],
            });

            const updateUser = await User.findByIdAndUpdate({_id: req.user.id} , {$push:{courseProgress: newCourseProgress._id}} , {new: true});

            return res.status(200).json({
                success: true,
                message: "Lecture marked as complete",
                data: newCourseProgress,
            });
        
        }

        return res.status(200).json({
            success: true,
            message: "Lecture marked as complete",
            data: courseProgress,
        });



    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Failed to mark lecture as complete",
            error: error.message,
        });
    }
}