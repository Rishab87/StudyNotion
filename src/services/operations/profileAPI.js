import { apiConnector } from "../apiconnector";
import { profileEndpoints } from "../apis";
import toast from "react-hot-toast";

export function getEnrolledCourses(token){
    return async(dispatch)=>{
        const toastId = toast.loading('loading...');
        let result = [];
        try{
            const response = await apiConnector("GET" , profileEndpoints.GET_USER_ENROLLED_COURSES_API , {},  {Authorization: `Bearer ${token}`})
    
            if(!response.data.success){
                throw new Error(response.data.message);
            }
        }catch(error){
            toast.error(error.message);
        }

        toast.dismiss(toastId);
    }
}