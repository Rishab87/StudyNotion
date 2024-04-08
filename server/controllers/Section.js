//tag ko category se replace krdiya hai front end main uska drop downn menu hoga aur tags ab comma seperated strings hai
//HW: tags ko har jagah category se replace kre --> DONE
const Section = require('../models/Section');
const Course = require('../models/Course');
const { mediaDeleter } = require('../utils/mediaDeleter');

//HW try it --> DONE
//create section
exports.createSection = async(req ,res)=>{
    try{
        const {sectionName , courseId} =req.body;

        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const newSection = await Section.create({sectionName});

        const updatedCourse = await Course.findByIdAndUpdate( courseId , {$push:{courseContent:newSection._id}} , {new: true}).populate({
            path: 'courseContent',
            populate: {
                path: 'subSection',
            },
        }).exec();  //Populating elements inside an array in Mongoose involves a similar approach to populating a single field
        //DONE: HW: populate ko idhr kaise use kre taki dono subSection aur Section ka data ajaye idhr hi

        return res.status(200).json({
            success: true,
            message: "Section added successfully",
            updatedCourse,
        });
        

    } catch (error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the section",
            error: error.message,
        });
    }
}

//delete section
exports.deleteSection = async(req , res)=>{
    try{
        //HW: TEst with params
        const {sectionId , courseId} = req.body; //assuming we are sending id in params

        if(!sectionId){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        //HW: delete krne pr course main array auto update hogya usmain se bhi section automatically delete hogya why? Findout..
        //TODO: do we need to delete the entry of section in courseContent array?(we will do in testing)
        //   await Course.findByIdAndUpdate(courseId , {$pull:{courseContent: sectionId}});
        
        const deletedSection = await Section.findByIdAndDelete(sectionId).populate("subSection");

        deletedSection.subSection.forEach((subSec)=>{
            mediaDeleter(subSec.videoUrl.split('/').pop().split('.')[0]);
        })

        const courseUpdate = await Course.findByIdAndUpdate(courseId , {$pull:{courseContent: sectionId}} , {new: true}).populate({
            path: 'courseContent',
            populate: {
                path: 'subSection',
            },
        });

        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
            data: courseUpdate,
        });

    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the section",
            error: error.message,
        });
    }
}

//update section
exports.updateSection = async(req ,res)=>{
    try{
        const {sectionName , sectionId} = req.body;

        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        updatedSection = await Section.findByIdAndUpdate(sectionId, {sectionName} , {new: true});
        
        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            data: updatedSection,
        });

    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the section",
            error: error.message,
        });
    }
}