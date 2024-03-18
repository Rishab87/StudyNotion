import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { courseEndpoints } from "../apis";

export const fetchCourseCategories = async()=>{
    let res = [];
    try{
        const response = await apiConnector("GET" , courseEndpoints.COURSE_CATEGORIES_API);
        if(!response?.data?.success){
            throw new Error(response.data.message);
        }

        res = response.data.allCategories;

    } catch(error){
        toast.error(error.message);
    }

    return res;
}

export const addCourseDetails = async(formData , token)=>{
    let result = null
    const toastId = toast.loading("Loading...")

    try{
        const response = await apiConnector("POST"  , courseEndpoints.CREATE_COURSE_API , formData, {
            "Content-Type": "multipart/form-data",
            Authorisation: `Bearer ${token}`});

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        result = response.data.data;
        toast.success("Course created successfully");
        
    } catch(error){
        toast.error(error.message);
        console.log(error);
    }

    toast.dismiss(toastId);
    return result;
}

export const editCourseDetails = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("PUT", courseEndpoints.EDIT_COURSE_API, data, {
        "Content-Type": "multipart/form-data",
        Authorisation: `Bearer ${token}`,
      })
      console.log("EDIT COURSE API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Update Course Details")
      }
      toast.success("Course Details Updated Successfully")
      result = response?.data?.data
    } catch (error) {
      console.log("EDIT COURSE API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
  }

  
export const fetchCourseDetails = async (courseId) => {
    const toastId = toast.loading("Loading...")
    //   dispatch(setLoading(true));
    let result = null
    try {
      const response = await apiConnector("POST", courseEndpoints.COURSE_DETAILS_API, {
        courseId,
      })
      console.log("COURSE_DETAILS_API API RESPONSE............", response)
  
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      result = response.data
    } catch (error) {
      console.log("COURSE_DETAILS_API API ERROR............", error)
      result = error.response.data
      // toast.error(error.response.data.message);
    }
    toast.dismiss(toastId)
    //   dispatch(setLoading(false));
    return result
}