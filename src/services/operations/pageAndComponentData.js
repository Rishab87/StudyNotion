import toast from "react-hot-toast"
import { apiConnector } from "../apiconnector";
import { catalogData } from "../apis";

export const getCalalogPageData = async (categoryId) => {
    const toastId = toast.loading("Loading...");
    let result = [];
    try{

        const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API, {categoryId});

        if(!response.data.success){
            throw new Error(response.data.message);
        }
        result = response.data;
        console.log(result);
        console.log("Catalog Page Data fetched successfully");

    } catch(error){
        toast.error(error.message);
    }
    toast.dismiss(toastId); 
    return result;
}