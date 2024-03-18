import { apiConnector } from "../apiconnector";
import { profileEndpoints } from "../apis";
import toast from "react-hot-toast";

export function getUserEnrolledCourses(token){
    return async(dispatch)=>{
        const toastId = toast.loading('loading...');
        let result = [];
        try{
            const response = await apiConnector("GET" , profileEndpoints.GET_USER_ENROLLED_COURSES_API , {},  {Authorisation: `Bearer ${token}`})
    
            if(!response.data.success){
                throw new Error(response.data.message);
            }

            result = response.data.courses;
        }catch(error){
            toast.error(error.message);
        }

        toast.dismiss(toastId);
        return result;
    }
}