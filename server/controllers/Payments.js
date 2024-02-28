const {instance} = require('../config/razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const {courseEnrollmentEmail} = require('../mail/templates/courseEnrollmentEmail');
const { default: mongoose } = require('mongoose');

//capture the payment and initiate the razorpay order
exports.capturePayment  = async(req , res)=>{
    const {courseId} = req.body;
    const userId = req.user.id;  

    if(!courseId){
        return res.json({
            success: false,
            message: "Please provide valid course Id",
        });
    }
    let course;
    try{

        course = await Course.findById(courseId);
        if(!course){
            return res.json({
                success: false,
                message: "Could not find the course",
            });
        }

        //user already has the same course or not
        //students enrolled main userId object Id ke form  main hai aur humare pass str ke form main toh objectId main convert krliya to check yeh userId studentsEnrolled array main hai ya nhi
        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success: false,
                message: "Student is already enrolled",
            });
        }

    } catch(error){
        return res.status(500).json({
            success: true , 
            message: error.message,
        });
    }

    //order create
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount*100, //razorpay ke docs mainn tha amount ke 100 se multiply krke bhjna hai manlo 300.00 hai toh 30000
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes:{
            courseId,
            userId,
        }
    }

    try{
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            //order id se status pta kr skte hai order ka kya woh order out for delivery hai , mumbai main hai etc
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        });

    } catch(error){
        return res.json({
            success: false,
            message: "Could not initiate order"
        });
    }
};

//verify signature of razorpay and server

exports.verifySignature = async(req , res)=>{
    const webhookSecret = '12345678';

    //2nd signature razorpay bhejega ka header ke andar , btw what is request header and body etc how data is tranfer takes place in air?
    const signature = req.headers['x-razorpay-signature']; //yeh razorpay ke behaviour hai ki header main iss key main secret key hogi
    
    //crypto install krne ki zarurat nhi ab built in module hai
    //sha jo hai woh aisi hashing algorithm hai jismain kisi cheez ke need nhi pdti hai aur hash kr skte hai
    //pr Hmac combination hai do cheezo ka idhr algo and secret key ki need pdti hai 
    const shasum = crypto.createHmac("sha256" , webhookSecret); //Hmac matlab hashed based message authentication code --> hashes code using hash algo and secret key
    //HW: Find out what is checksum

    //we have to convert this hmac obj to string. what is hmac object?
    shasum.update(JSON.stringify(req.body)); //jab hashing algorithm run krte hai kisi particular input ke liye toh jo output ataa usmain kuch cases main uss output ko digest kehte hai jo generally hexadecimal format main hota hai , why we call some output digest?and which output
    const digest = shasum.digest("hex");

    if(signature === digest){
        console.log("Payment is Authorised");
        //abhi razorpay se request ayi hai frontend se nhi  , directly razorpay ke webhook ke dvara api hit hui hai toh courseId kaha se laye?
        //notes se upr options main notes dala hai usmain jan bujh ke courseId userId pass hui thi
        const {courseId , userId} = req.body.payload.payment.entity.notes;

        try{
            //validation ki zarurat nhi upr validate krke hi bhja tha data
            const enrolledCourse = await Course.findOneAndUpdate({_id: courseId} , {$push:{studentsEnrolled: userId}} , {new: true});
            //yeh validation lgane ki pr zarurat toh shyd nhi honi chahiye kyunki courseId toh sahi hai toh ussi id ka course hoga hi
//             Reasons for Validations:
//             Data Consistency: Ensures that the data being operated on is consistent and exists in the system. If the courseId is not valid or corresponds to a non-existent course, it prevents subsequent operations that might lead to errors or unexpected behavior.
//             User Input Verification: It guards against potential issues, whether caused by incorrect user input or malicious actions. Without these checks, a user could manipulate the request to provide an invalid courseId, leading to unintended consequences.
//             Error Handling: By checking for the existence of the course and returning a clear error message, it helps developers and users understand why a specific operation failed. This aids in debugging and provides a better user experience.
//             Security: Validating input and ensuring that requested resources exist is a security best practice. It helps prevent scenarios like SQL injection or unauthorized access to non-existent resources.
            if(!enrolledCourse){
                return res.status(500).json({
                    success: false,
                    message: "Course not found",
                });
            }
            // what if someone intercepts the secret key what they can do with that? Read from chatGPT

            console.log(enrolledCourse);
            const enrolledStudent = await User.findOneAndUpdate({_id: userId}, {$push:{courses: courseId}} , {new: true});

            console.log(enrolledStudent);

            //mail send

            const emailResponse = await mailSender(
                enrolledStudent.email , 
                "Congratulations from StudyNotion" , courseEnrollmentEmail(enrolledCourse.courseName , enrolledStudent.firstName)
            );

            console.log(emailResponse);
            return res.status(200).json({
                success: true , 
                message: "Singature Verified and Course Added",
            });
        } catch(error){
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }  
    else{
        return res.status(400).json({
            success: false,
            message: "Invalid request",
        });
    }
};