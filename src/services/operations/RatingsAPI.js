import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { courseEndpoints, ratingsEndpoints } from "../apis";

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

export const createRating = async(data, token)=>{
    const toastId = toast.loading("loading...");
    try{

        const res = await apiConnector("POST" , courseEndpoints.CREATE_RATING_API , data , {Authorisation: `Bearer ${token}`});

        if(!res.data.success){
            throw new Error(res.data.message);
        }

        toast.success("Rating created successfully");

    } catch(error){
        console.log(error);
        toast.error(error.message);
    }
    toast.dismiss(toastId);
}

export const getRatings = async()=>{
    let ratings = [];

    try{

        const res = await apiConnector("GET" , ratingsEndpoints.GET_REVIEWS_API
         , {});

         if(!res.data.success){
             throw new Error(res.data.message);
         }

         ratings = res.data.data;

    } catch(error){
        console.log(error);
        toast.error(error.message);
    }

    return ratings;

}