const mongoose = require('mongoose');
const User = require('../models/User'); //pehle user modle wali file ka name user tha isliye user likhna pd rha hai url main pr kyun aisa?
const otpGenerator = require('otp-generator');
const OTP = require('../models/OTP');
const bcrypt = require('bcrypt');
const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const mailSender = require('../utils/mailSender');
const validator = require('validator');
const passMailTemplate = require('../mail/templates/passwordUpdate');

//sendOTP
exports.sendOTP = async (req, res)=>{
    try{
        const {email} = req.body;
        // function splitEmail(email) {
        //     const [localPart, domain] = email.split('@');
        //     return { localPart, domain };
        // }
        //DONE: HW: aur bhi validation like email glt to nhi aagyi woh kro
        //validator library used for complex validations --> it has functions which can performns validation like TLD this can check if domain exists , it can check if email is undeliverable etc you can read from chatgpt all validations it does in depth
        // if (!validator.isEmail(email) || !validator.isFQDN(splitEmail(email).domain) || validator.isDisposableEmail(email) && validator.isEmail(email, { allow_utf8_local_part: false })){
        //     // additional checks are performed using various validator methods to ensure that the email is not disposable, not role-based, and that the domain has valid MX records. Keep in mind that the necessity of these checks depends on your application's requirements and the level of validation you want to enforce.
        //     return res.status(400).json({
        //         success: false,
        //         message: "Invalid email",
        //     });
        // } 
        const checkUserPresent =  await User.findOne({email});
    
        //if user exists return a response
        if(checkUserPresent){
            return res.status(401).json({
                success: false,
                message: "User already registered",
            });
        }

        //generate otp
        var otp = otpGenerator.generate(6 , { //6 length only numeric characters
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        // console.log("OTP Generated: " , otp);

        //check unique otp or not
        const result = await OTP.findOne({otp:otp});
  
        //bekar code hai company wagera main aisa otp generator use kro jo har bar unqiue otp generate krta ho , find out koi package jo unique otp generate kre
        while(result){
            otp = otpGenerator.generate(6 , { //6 length only numeric characters
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({otp:otp});
        }

        const otpPayload = {email , otp};

        //create an entry in db
        const otpBody = await OTP.create(otpPayload);
        // console.log(otpBody);

        res.status(200).json({
            success: true , 
            message: "OTP Sent Successfully",
            otp,
        })


    } catch(error){
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

//Signup
exports.signup = async(req, res)=>{
    try{
           //data fetch from req
    const{
        firstName ,
        lastName , 
        email,
        password , 
        confirmPassword,
        accountType,
        contactNumber,
        otp,
    } = req.body;

    //validate 
    if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
        return res.status(403).json({
            success: false,
            message: "All fields are required",
        });
    }

    //2 password match --> agar front end pe manlo jo red box bna ata hai jab pass match nhi hote woh use krenge tab udhr hi check krna pdega pass match ho rhe hai ya nhi bar bar save krake db main call toh marenge nhi toh idhr phir pass match krne ki zarurat bhi hai?
    if(password != confirmPassword){
        return res.status(400).json({
            success: false,
            message: "Passwords do not match",
        });
    }

    //check user already exist or not --> pr woh toh uper bhi check kra liya otp bhjne se pehle toh zarurat toh nhi lg rhi iski
    const existingUser = await User.findOne({email});

    if(existingUser){
        return res.status(400).json({
            success: false,
            message: "User is already registered"
        });
    }
    
    //find most recent otp stored for the user
    const recentOtp = await OTP.find({email}).sort({createdAt: -1}).limit(1); //find out meaning of createdAt: -1 and limit
    console.log(recentOtp);

    //otp validate
    if(recentOtp.length == 0){
        return res.status(400).json({
            success: false,
            message: "OTP not found",
        });
    } else if(otp !== recentOtp[0].otp){
        //invalid otp
        return res.status(400).json({ //agar dhang se sort kra hai toh iski bhi zarurat nhi pdna chahiye?
            success: false,
            message: "Invalid OTP",
        })
    }


    //hash pass
    // bcrypt.genSalt(10 ) add genSalt read from chatgpt what is this and you can also put retries in this
    const hashedPassword = await bcrypt.hash(password , 10);

    const profielDetails = await Profile.create({
        gender: null,
        dateOfBirth: null,
        about: null,
        contactNumber: null
    })

    //entry in db
    const user = await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password: hashedPassword,
        accountType,
        additionalDetails: profielDetails._id,
        image: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${firstName}`
    });

    //return res
    return res.status(200).json({
        success: true,
        message: "User is registered successfully",
        user,
    })
    } catch(error){
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again"
        })
    }
 
}

//Login
exports.login = async(req ,res)=>{
    try{
        //get data from req body
        const {email , password} = req.body;

        //validate
        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: "All fields are required , please try again",
            });
        }

        //user exists
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User is not registered , please signup first",
            });
        }

        //generate jwt , after password n=matching
        if(await bcrypt.compare(password , user.password)){
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload , process.env.JWT_SECRET , {
                expiresIn: "2h",
            });
            user.token = token;
            user.password = undefined;

            //create cookie and response
            const options = {
                httpOnly: true,
                expires: new Date(Date.now() + 3*24*60*60*1000), //3days
            }
            res.cookie("token" , token , options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged In Successfully",
            });
        }
        else{
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            });
        }

    } catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Login failure , please try again",
        });
    }
}

//implement a system like google ki login ke baad mail send krdiya it was me wala aur no pe click krne pr change password wale page pe lajayenge user ko

//DONE: changePassword - HW - user jab password bhula nhi pr khud se jab change kr rhe hai
exports.changePassword = async(req , res)=>{
    try{

        //fetch data
        const {email , password , newPassword  , confirmNewPassword} = req.body;

        //get oldPassword , newPassword , confirmNewPassword
        const user = User.findOne({email});

        //validation
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found",
            }) 
        }

        const isSame = await bcrypt.compare(password , user.password);

        if(!isSame){
            return res.status(401).json({
                success: false,
                message: " Old Password entered is incorrect",
            });
        }

        if(newPassword !== confirmNewPassword){
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        //update pwd in db 
        //add genSalt for more security
        hashedPassword = bcrypt.hash(newPassword , 10);

        await User.findOneAndUpdate({email: email} , {password: hashedPassword} , {new: true});

        //send mail -pwd updated
        mailSender(email , "Password Updated Successfully" , passMailTemplate(email , `Password updated successfully for ${user.firstName} ${user.lastName}`));

        //return res
        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        })

    } catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while changing the password. Please try again."
        })
    }
}