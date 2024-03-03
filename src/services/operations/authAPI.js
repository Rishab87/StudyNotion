import toast from 'react-hot-toast';
import {setLoading} from '../../slices/authSlice'
import { apiConnector } from '../apiconnector'
import { endpoints } from '../apis';

export function sendOtp(email , navigate){
    return async(dispatch) => {
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST" , endpoints.SENDOTP_API , {email});
            console.log(response);

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("OTP sent successfully");
            dispatch(setLoading(false));
            navigate('/verify-email');

        } catch(error){
            console.log(error);
            toast.error(error);
        }
    }
}

export function Signup(
    accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate
){
    return async(dispatch)=>{
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST" , endpoints.SIGNUP_API , {accountType , firstName , lastName , email , password , confirmPassword , otp});

            console.log(response);

            if(!response.data.success){
                throw new Error(response.data.message);
            }
            toast.success("Signed Up  successfully");
            dispatch(setLoading(false));

            navigate('/login');

        } catch(error){
            toast.error(error);
            console.log(error);
        }
    }
}

export function login(email , password){
    return async(dispatch)=>{
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST" , endpoints.LOGIN_API , {email , password});
            console.log(response);

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("Logged in successfully");
            dispatch(setLoading(false));

        } catch(error){
            toast.error(error);
            console.log(error);
        }

    }
}

export function getPasswordResetToken(email , setEmailSent){
    return async(dispatch)=>{
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST" , endpoints.RESETPASSTOKEN_API  , {email})
            console.log(response)

            if(!response.data.success){
                throw new Error(response.data.message)
            }

            toast.success("Reset Email Sent");
            setEmailSent(true);

        } catch(error){
            console.log(error);
            toast.error("Failed to send email for reseting password")
        }

        dispatch(setLoading(false));
    }
}

export function resetPassword(password , confirmPassword , token){
    return async(dispatch)=>{
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST" , endpoints.RESETPASSWORD_API , {password , confirmPassword , token});

            console.log(response);

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("Password has been reset successfully");

        } catch(error){
            toast.error("Unable to reset password");
        }
        dispatch(setLoading(false));
    }
}