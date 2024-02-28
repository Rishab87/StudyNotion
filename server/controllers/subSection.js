const SubSection = require('../models/SubSection');
const Section = require('../models/Section');
const {uploadImageToCloudinary} = require('../utils/imageUploader');
require('dotenv').config();

//create SubSection

exports.createSubSection = async(req, res)=>{
    try{

        const {sectionId , title  , timeDuration , description} = req.body;

        //extract vidoe file
        const video = req.files.videoFile;

        //upload to cloudinary
        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(400).json({
                success: true , 
                message: "All fields are required",
            });
        }

        const uploadDetails = await uploadImageToCloudinary(video , process.env.FOLDER_NAME);
        
        const subSectionDetails = await SubSection.create({title , timeDuration , description , videoUrl: uploadDetails.secure_url});

        const updatedSection = await Section.findByIdAndUpdate({_id: sectionId} , {$push:{subSection: subSectionDetails._id}} , {new: true}).populate('subSection');
        console.log(updatedSection); //null print ho rha hai check it out

        return res.status(200).json({
            success: true , 
            message: "Section updated successfully",
            updatedSection,
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
        const {subSectionId , title , timeDuration , description} = req.body;
    
        //agar pehle se video dal rkhi hai aur dubara se video nhi bhejni toh woh kaise hoga front end main ki video dikhe purani attatch hui pr bhije bhi na
        //ek kam kr skte hai ki video agar badalni ho toh woh subsection delete krke new bnao pr upr wala bhi socho kaise krenge
        if(!subSectionId || !title || !timeDuration || !description){
            return res.status(400).json({
                success: true , 
                message: "All fields are required",
            });
        }
    
        updatedSubSection = await SubSection.findByIdAndUpdate(subSectionId , {title , timeDuration , description , video} , {new: true});
    
        return res.status(200).json({
            success: true , 
            message: "Sub Section updated successfully",
            updateSubSection,
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
        const {subSectionId} = req.body;

        if(!subSectionId){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        //Delete video from cloudinary
        //cloudinary.uploader.destroy(public_id)

        //TODO: do we need to delete the entry of subsection in section (we will do in testing)
        await SubSection.findByIdAndDelete(subSectionId);

        return res.status(200).json({
            success: true , 
            message: "Sub Section deleted successfully",
        });

    } catch(error){
        return res.status(500).json({
            success: false ,
            message: "Something went wrong while deleting the sub section",
            error: error.message,
        });
    }
}