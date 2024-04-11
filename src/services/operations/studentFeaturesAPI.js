import { studentEndpoints } from "../apis";
import toast from 'react-hot-toast';
import rzpLogo from '../../assets/TimeLineLogo/Logo1.svg';
import {apiConnector} from '../apiconnector';
import {resetCart} from '../../slices/cartSlice';

function loadScript(src){
    return new Promise((resolve)=>{
        const script = document.createElement('script');
        script.src = src;
        script.onload = ()=>{
            resolve(true);
        }
        script.onerror = ()=>{
            resolve(false);
        }
        document.body.appendChild(script);
    })
}

export const buyCourse = async (token , courses , userDetails , navigate , dispatch) => {
    const toastId = toast.loading("loading...");

    try{
       const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

       if(!res){
        toast.error("Failed to load payment gateway");
        throw new Error("Failed to load payment gateway");
       }

       const orderRes = await apiConnector("POST" , studentEndpoints.COURSE_PAYMENT_API , {courses} , {Authorisation: `Bearer ${token}`});

       if(!orderRes.data.success){
        toast.error("Failed to create order");
        throw new Error(orderRes.data.message);
       }
    //    console.log(orderRes);

       const options=  {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        currency: orderRes.data.currency,
        amount: orderRes.data.amount,
        order_id: orderRes.data.orderId,
        name: "StudyNotion",
        description: "Thank you for buying the course",
        image: rzpLogo,
        prefill: {
            name: userDetails.firstName,
            email: userDetails.email
        },
        handler: function(response){
            sendPaymentSuccessEmail(response , orderRes.data.amount , token);
            verfiyPayment({...response , courses} , token , navigate , dispatch);
        }
    };

    console.log(options);

    const paymentObject = new Razorpay(options);
    paymentObject.open();
    paymentObject.on('payment.failed' , function(response){
        toast.error("Payment failed");
        console.log(error);
    })

    } catch(error){
        if(error.response.status === 500)
            toast.error("Failed to create order");
        else
            toast.error("Student is already enrolled");
        console.log(error);
    }
    
    toast.dismiss(toastId);
};

async function sendPaymentSuccessEmail(response , amount , token){
    try{
        await apiConnector("POST" , studentEndpoints.SEND_PAYMENT_SUCCESS_EMAIL_API  , {orderId: response.razorpay_order_id ,amount ,  paymentId: response.razorpay_payment_id} ,{Authorisation: `Bearer ${token}`});

    } catch(error){
        console.log("PAYMENT SUCCESS EMAIL ERROR:" , error);
    }
}

async function verfiyPayment(bodyData , token , navigate , dispatch){
    const toastId = toast.loading("Verifying payment...");
    try{
        const res = await apiConnector("POST" , studentEndpoints.COURSE_VERIFY_API , bodyData , {Authorisation: `Bearer ${token}`});

        if(!res.data.success){
            throw new Error(res.data.message);
        }   

        toast.success("Payment successfull");

        navigate('dashboard/enrolled-courses');
        dispatch(resetCart());

    } catch(error){
        toast.error(error.message);
        console.log("VERIFY PAYMENT ERROR:" , error);
    }
    toast.dismiss(toastId);
}