import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { ratingsEndpoints } from "../apis";

export function getCourseAvgRating(courseId){
    return async(dispatch)=>{
        const toastId = toast.loading("loading...");
        let review;
        try{
            const res = await apiConnector("GET" ,ratingsEndpoints.AVG_REVIEWS_API , {courseId});

            if(!res.data.success){
                throw new Error(res.data.message);
            }

            review = res.data.averageRating;
            
        } catch(error){
            toast.error(error.message);
        }

        toast.dismiss(toastId);

        return review;
    }
}