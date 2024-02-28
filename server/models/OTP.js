const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const emailTemplate = require('../mail/templates/emailVerificationTemplate');

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true,
    },
    otp:{
        type:String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        expires: 5*60, //min baad delete hojayegi
    },
});

async function sendVerificationEmail(email , otp){
    try{
        const mailResponse = await mailSender(email , "Verification Email from StudyNotion" , emailTemplate(otp));
        console.log("Email sent successfully: " , mailResponse);
    } catch(error){
        //ek string bhi sath main lihkdo jab production level code lihk rhe hote hai tab samne wala vyakti bhi smjh jaye kaha code fata hoga uske liye string add krdo ,  
        console.error("error occured while sending mail: " , error);
        throw error;
    }
}

OTPSchema.pre("save" , async function(next){
    await sendVerificationEmail(this.email , this.otp); //this reperesents current object
    next();
});

module.exports = mongoose.model("OTP" , OTPSchema); 