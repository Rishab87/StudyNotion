//singup krte time ek profile main sari details null krdi thi isliye profile upadte krna pdega crate nhi
const Profile = require('../models/Profile');
const User = require('../models/User');
const cron = require('node-cron');
const Course = require('../models/Course');
const {uploadImageToCloudinary} = require('../utils/imageUploader');
// const CourseProgress = require('../models/CourseProgress');

exports.updateProfile = async(req , res)=>{
    try{
        //We can get userId from req.user obj usmain decode add krdiya tha authentication ke baad
        const {dateOfBirth ="" , about = "" , contactNumber , gender=""} = req.body; //profile main kuch cheeze optional hai isliye unhe by default "" yeh hona chahiye
        
        const id = req.user.id;

        if(!contactNumber || !id){
            return res.status(400).json({
                success: false,
                message: "Please fill the required fields",
            });
        } 

        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();//The save() function in Mongoose can both update and create documents. If the document does not exist in the database, save() will create it. If the document already exists, save() will update it.

        profileDetails.contactNumber = undefined //taki response mai na chle jaye phone no.

        const updatedUserDetails = await User.findById(id).populate('additionalDetails');

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUserDetails,
        });


    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the profile",
            error: error.message,
        });
    }
}

//deleteAccount
//DONE--->HW: Find a way to scedule a request let say ek handler function bna diya delete account ka aur hum chahte hai delete ki request krne ke 5 din baad delete ho taki manlo glti se delete krdiya ho toh recover kr ske 5 din main toh scedule kaise kre request? find out
//HW: Find out what is cronjob --> DONE READ FROM GOOGLE TO REVISE 
exports.deleteAccount = async(req ,res)=>{
    //cronjob is also working successfully
    try{
        // cron.schedule('0 0 */5 * *', async function(){ //sceduled for 5 days

        //   });

                      //profile bhi delete krvadenge obviously user delete hoga toh uski profile details kyun faltu main store krenge
                      const id = req.user.id;

                      const userDetails = await User.findById(id);
                      if(!userDetails){ //btw yeh validate krne ki zarurat nhi
                          return res.status(404).json({
                              success: false,
                              message: "User not found",
                          });
                      }
                      //student delete hogya toh student enrolled update krna pdega same question like inside section.js file(we'll know when testing)
                      await Profile.findByIdAndUpdate({_id: userDetails.additionalDetails});
                      //HW: delete from enrolled courses 
                      await User.findByIdAndUpdate({_id: id});
                    
                      return res.status(200).json({
                          success: true,
                          message: "Account deleted successfully",
                      });
        //   return res.status(200).json({
        //     success: true , 
        //     message: "Account will be deleted within 5 days",
        //   });
        
    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the account",
            error: error.message,
        });
    }
}

exports.getAllUserDetails = async(req, res)=>{
    try{
        const id = req.user.id;

        const userDetails = await User.findById(id).populate('additionalDetails').exec();

        return res.status(200).json({
            success: true,
            message: "User data fetched successfully",
            userDetails,
        });

    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching user details",
            error: error.message,
        });
    }
}

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        2000,
        2000
      )
      // console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};

exports.getEnrolledCourses = async (req, res) => {
    try {
      
      const userDetails = await User.findById(req.user.id).populate({
        path: 'courses',
        populate: {
          path: 'courseContent',
          populate: {
            path: 'subSection',
          }
        }
      }
     
      );

      console.log(userDetails);
      
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userId}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};

exports.contactUs = async(req, res)=>{
  try{
    

  } catch(error){
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.instrcutorDashboard = async(req, res)=>{
  try{

    const courseDetails = await Course.find({instructor: req.user.id});

    const courseData = courseDetails.map((course)=>{
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalAmountEarned = totalStudentsEnrolled * course.price;

      const courseWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        totalStudentsEnrolled,
        totalAmountEarned,
      }

      return courseWithStats;
    });

    return res.status(200).json({
      success: true,
      message: "Instructor dashboard data fetched successfully",
      data: courseData,
    });


  } catch(error){
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}