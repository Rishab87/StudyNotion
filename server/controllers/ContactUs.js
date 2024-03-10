const {contactUsEmail} = require('../mail/templates/contactFormRes');
const mailSender = require('../utils/mailSender');

exports.contactUsController = async(req ,res)=>{
    const {email , firstName , message, phoneNo , countryCode} = req.body;

    try{

        await mailSender(process.env.OWNER_ID , "Customer Query" , contactUsEmail(email , firstName , lastName , message , phoneNo , countryCode));
        const emailRes = await mailSender(email , "Your Data send successfully" , contactUsEmail(email , firstName , lastName , message , phoneNo , countryCode));

        return res.status(200).json({
            success: true,
            message: "Email sent successfully",
        });

    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending mail",
            error: error.message,
        })
    }
}