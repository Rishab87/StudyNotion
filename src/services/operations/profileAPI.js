import { apiConnector } from "../apiconnector";
import { profileEndpoints } from "../apis";
import toast from "react-hot-toast";

export async function getUserEnrolledCourses(token){
        const toastId = toast.loading('loading...');
        let result = [];
        try{
            const response = await apiConnector("GET" , profileEndpoints.GET_USER_ENROLLED_COURSES_API , {},   {Authorization: `Bearer ${token}`})
            if(!response.data.success){
                throw new Error(response.data.message);
            }

            result = response.data.data;
            // console.log(result);
        }catch(error){
            toast.error(error.message);
        }
        toast.dismiss(toastId);
        return result;
}

export const getInstrcutrorDashboardData = async(token)=>{
    const toastId = toast.loading('loading...');
    let result = [];
    try{
        const response = await apiConnector("GET" , profileEndpoints.GET_INSTRUCTOR_DETAILS_API , {},  {Authorization: `Bearer ${token}`});
        if(!response.data.success){
            throw new Error(response.data.message);
        }

        result = response?.data;

    } catch(error){
        toast.error(error.message);
        console.log(error);
    }

    toast.dismiss(toastId);
    return result;
}