//in this when user clicks on forgot password we send a mail to the user with a front end link to reset password page then user can go to that link and change the password and password will get updated in db
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

//resetPasswordToken -- mail send krne ka kam kr rhe hai
exports.resetPasswordToken = async(req,res)=>{

    try{
        //get email from req body
        const email = req.body.email;

        //check user for this email , email validation
        const user = await User.findOne({email});

        if(!user){
            return res.json({
                success: false,
                message: "Your email is not registered with us",
            });
        }


        //token generate -> har user ke schema main token aur uska expiration time rkhdo toh har user ke pass khudka token hoga aur uska expiration time hoga toh bohot asaan hojayega user aur token ki mapping krna isliye user ke model main token ki field bandenge ab
        const token = crypto.randomUUID(); //crypto module ab inbuilt hai nodejs main
        //randomly generated , 36 char long v4 uuid ajayegi .randomUUID se


        //update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate({email: email} , {
            token:token,
            resetPasswordExpires: Date.now() + 50*60*1000,
        } , {new: true});

        //create url
        const url = `http://localhost:3000/update-password/${token}` //front end ke link main ek differentiating factor token hai jisse alag alag link bnenge taki har user ke liye different link bne password chsnge krne ka har user ek link se thodi change krlega aur time limit bhi dal payenge ki itne der baad link expire

        //send mail with url
        await mailSender(email , "Password Reset Link" , `Password Reset Link: ${url}`);


        //return response
        return res.json({
            success:  true,
            message: "Email sent successfully",
        });

    } catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending reset password mail",
        });
    }
   
}


//resetPassword - db main update kr rha hai
exports.resetPassword = async(req , res)=>{
    try{

        //user ki entry token ka use krke nikalenge isliye user ke andar token dala tha
        //data fetch
        //token toh url main se req.params krke bhi nikal skte the toh body main kaha se aagya? front end ne url se nikalke body main daldiya
        const {password , confirmPassword , token} = req.body;

        //validation 
        if(password !== confirmPassword){
            return res.json({
                success: false,
                message: "Passwords do not match",
            });
        }

        //get userdetails from db using token
        const userDetails = await User.findOne({token});

        //if no entry invalid token
        if(!userDetails){
            return res.json({
                success: false,
                message: "Token invalid",
            });
        }

        //token check time
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success: false,
                message: "Token is expired , please regenerate your token",
            }) //token delete nhi kraya kyunki uper wale function main token generate krke update kr rhe hai user main 
        }

        //hash pwd
        const hashedPassword = await bcrypt.hash(password , 10);

        //password update
        await User.findOneAndUpdate({token: token} , {password: hashedPassword} , {new: true});

        //response return
        return res.status(200).json({
            success: true,
            message: "Password reset successful"
        });

    } catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while changing password in database",
        })
    }

}