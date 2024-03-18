import toast from 'react-hot-toast';
import {setLoading, setToken} from '../../slices/authSlice'
import { apiConnector } from '../apiconnector'
import { endpoints } from '../apis';
import { setUser } from '../../slices/profileSlice';
import { resetCart } from '../../slices/cartSlice';

//2 baar otp kyun send ho rha hai find out?
export function sendOtp(email , navigate){
    return async(dispatch) => {
        dispatch(setLoading(true));
        const toastId  = toast.loading('loading...');
        try{
            const response = await apiConnector("POST" , endpoints.SENDOTP_API , {email});
            console.log(response);

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("OTP sent successfully");
            navigate('/verify-email');

        } catch(error){
            console.log(error);
            toast.error(error.message);
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
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
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST" , endpoints.SIGNUP_API , {accountType , firstName , lastName , email , password , confirmPassword , otp});

            console.log(response);

            if(!response.data.success){
                throw new Error(response.data.message);
            }
            toast.success("Signed Up  successfully");

            navigate('/login');

        } catch(error){
            toast.error(error.message);
            console.log(error);
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

export function login(email , password , navigate){
    return async(dispatch)=>{
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST" , endpoints.LOGIN_API , {email , password});
            console.log(response);
            
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            //It would be better when logging in again instead of storing data in local storage we can send token through header and fetch all details instead of getting all details from localStorage , only store token in localStorage
            //Accessibility is another important consideration. If a user needs to access their userInfo on multiple devices, it will be difficult to keep the data synchronized if it is stored in localStorage.
            //Performance is also a concern. Storing too much data in localStorage can slow down the user's browser.
            //In general, it is best to avoid storing userInfo in localStorage unless there is a specific reason to do so. If you do need to store userInfo in localStorage, be sure to take steps to protect the data and ensure that it is accessible to the user on all of their devices.
            //basically token is of no use if storing in local storage
            //DONE auth with token
            toast.success("Logged in successfully");
            dispatch(setToken(response.data.token))
            const userImage = response.data?.user?.image
            ? response.data.user.image
            : `https://api.dicebear.com/7.x/pixel-art/svg?seed=${response.data.user.firstName}`
          dispatch(setUser({ ...response.data.user, image: userImage }))
          
          localStorage.setItem("token", JSON.stringify(response.data.token))
        //localStorage.setItem("user", JSON.stringify(response.data.user))
          navigate("/dashboard/my-profile")
            

        } catch(error){
            if(error.response.status == 401){
                toast.error("Wrong id or password");
            }
            else{
                toast.error(error.message);
            }
            console.log(error); 
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);

    }
}

export function loginToken(token , navigate){
    return async(dispatch)=>{
        const toastId = toast.loading("loading...");
        dispatch(setLoading(true));
        try{

            const response = await apiConnector("POST" , endpoints.TOKEN_LOGIN , {} ,  {Authorisation: `Bearer ${token}`});
            if(!response.data.success){
                throw new Error(response.data.message);
            }

            const userImage = response.data?.user?.image
            ? response.data.user.image
            : `https://api.dicebear.com/7.x/pixel-art/svg?seed=${response.data.user.firstName}`
            dispatch(setUser({ ...response.data.user, image: userImage }))

        } catch(error){
            dispatch(logout(navigate));
        }

        dispatch(setLoading(false));
        toast.dismiss(toastId);
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

export function logout(navigate){
    return (dispatch)=>{
        dispatch(setToken(null));
        dispatch(setUser(null));
        dispatch(resetCart());
        localStorage.removeItem("token");
        // localStorage.removeItem("user");
        toast.success("Logged out");
        navigate('/');
    }
}