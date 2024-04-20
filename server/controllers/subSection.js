const SubSection = require('../models/SubSection');
const Section = require('../models/Section');
const {uploadImageToCloudinary} = require('../utils/imageUploader');
const Course = require('../models/Course');
const { mediaDeleter } = require('../utils/mediaDeleter');
require('dotenv').config();

//create SubSection

exports.createSubSection = async(req, res)=>{
    try{

        const {sectionId , title  , description , courseId , totalDuration} = req.body;

        //extract vidoe file
        const video = req.files.videoFile;
        //upload to cloudinary
        if(!sectionId || !title || !description || !video || !totalDuration){
            return res.status(400).json({
                success: false , 
                message: "All fields are required",
            });
        }

        const uploadDetails = await uploadImageToCloudinary(video , process.env.FOLDER_NAME);
        
        const subSectionDetails = await SubSection.create({title , description , videoUrl: uploadDetails.secure_url , totalDuration ,});

        const updatedSection = await Section.findByIdAndUpdate({_id: sectionId} , {$push:{subSection: subSectionDetails._id}} , {new: true}).populate('subSection');

        console.log(updatedSection); //null print ho rha hai check it out

        return res.status(200).json({
            success: true , 
            message: "Section updated successfully",
            data:updatedSection,
        });

    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the section",
            error: error.message,
        });
    }
}

//HW: Update and delete subSection
exports.updateSubSection = async(req ,res)=>{
    try{
        const {subSectionId , title , description , sectionId} = req.body;
    
        //agar pehle se video dal rkhi hai aur dubara se video nhi bhejni toh woh kaise hoga front end main ki video dikhe purani attatch hui pr bhije bhi na
        //ek kam kr skte hai ki video agar badalni ho toh woh subsection delete krke new bnao pr upr wala bhi socho kaise krenge
        if(!subSectionId || !title || !description){
            return res.status(400).json({
                success: true , 
                message: "All fields are required",
            });
        }
    
        const updatedSubSection = await SubSection.findByIdAndUpdate(subSectionId , {title , description } , {new: true});

        const updatedSection = await Section.findById(sectionId).populate('subSection');
    
        return res.status(200).json({
            success: true , 
            message: "Sub Section updated successfully",
            data: updatedSection,
        });
    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the sub section",
            error: error.message,
        });
    }
}

exports.deleteSubSection = async(req, res)=>{
    try{
        const {subSectionId , courseId , sectionId} = req.body;

        if(!subSectionId){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        //Delete video from cloudinary
        //cloudinary.uploader.destroy(public_id)

        //TODO: do we need to delete the entry of subsection in section (we will do in testing)
        const deletedDocument  = await SubSection.findByIdAndDelete(subSectionId);
        console.log(deletedDocument);
        await mediaDeleter(deletedDocument.videoUrl.split('/').pop().split('.')[0])
        const updatedSection = await Section.findByIdAndUpdate(sectionId , {$pull:{subSection: subSectionId}} , {new: true});


        return res.status(200).json({
            success: true , 
            message: "Sub Section deleted successfully",
            data: updatedSection,
        });

    } catch(error){
        return res.status(500).json({
            success: false ,
            message: "Something went wrong while deleting the sub section",
            error: error.message,
        });
    }
}