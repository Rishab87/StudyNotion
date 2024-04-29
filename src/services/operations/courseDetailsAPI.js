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
            Authorization: `Bearer ${token}`});

        if(!response.data.success){
            throw new Error(response.data.message);
        }
        console.log(response);
        result = response.data.data;
        console.log(JSON.stringify(result));
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
        Authorization: `Bearer ${token}`,
      })
      console.log("EDIT COURSE API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Update Course Details")
      }
      toast.success("Course Details Updated Successfully")
      result = response?.data?.updatedCourse
    } catch (error) {
      console.log("EDIT COURSE API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
  }

  
export const fetchCourseDetails = async (courseId , token) => {
    const toastId = toast.loading("Loading...")
    //   dispatch(setLoading(true));
    let result = null
    try {
      const response = await apiConnector("POST", courseEndpoints.COURSE_DETAILS_API, {
        courseId,
      } , {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
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

export const updateSection = async(data , token)=>{
  let res = null;
  const toastId = toast.loading("Loading...");
  try{

    const response = await apiConnector("POST" , courseEndpoints.UPDATE_SECTION_API , data , {
      Authorization: `Bearer ${token}`,
    });

    if(!response.data.success){
      throw new Error("Could not update section");
    }

    toast.success("Course Section updated");
    res = response.data.data;
    
  } catch(error){
    console.log(error);
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return res;
}

export const createSection = async(data , token)=>{
  let res = null;
  const toastId = toast.loading('loading...');
  try{
    const response  = await apiConnector("POST" , courseEndpoints.CREATE_SECTION_API , data , {Authorization: `Bearer ${token}`});

    if(!response.data.success){
      throw new Error(res.data.message);
    }

    toast.success("Section created successfully");

    res = response.data.updatedCourse;

  } catch(error){
    console.log(error);
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return res;
}

export const deleteSection = async(data, token)=>{
  const toastId = toast.loading("loading...");
  let res  = null;
  try{

    const response = await apiConnector("POST" , courseEndpoints.DELETE_SECTION_API , data , {Authorization: `Bearer ${token}`})

    if(!response.data.success){
      throw new Error(response.data.message);
    }

    res = response.data.data;

    toast.success("Section deleted successfully");

  }catch(error){
    console.log(error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return res;
}

export const deleteSubSection = async(data, token)=>{
  const toastId = toast.loading("loading...");
  let res  = null;
  try{

    const response = await apiConnector("POST" , courseEndpoints.DELETE_SUBSECTION_API , data, {Authorization: `Bearer ${token}`})

    if(!response.data.success){
      throw new Error(response.data.message);
    }

    res = response.data.data;
    toast.success("Sub-Section deleted successfully");

  }catch(error){
    console.log(error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return res;
}

export const createSubSection = async(data, token)=>{
  const toastId = toast.loading("loading...");
  let res  = null;
  try{

    const response = await apiConnector("POST" , courseEndpoints.CREATE_SUBSECTION_API , data, {Authorization: `Bearer ${token}`})

    if(!response.data.success){
      throw new Error(response.data.message);
    }

    res = response.data.data;
    toast.success("Sub-Section created successfully");

  }catch(error){
    console.log(error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return res;
}

export const updateSubSection = async(data, token)=>{
  const toastId = toast.loading("loading...");
  let res  = null;
  try{

    const response = await apiConnector("POST" , courseEndpoints.UPDATE_SUBSECTION_API , data, {Authorization: `Bearer ${token}`})

    if(!response.data.success){
      throw new Error(response.data.message);
    }

    res = response.data.data;
    toast.success("Sub-Section created successfully");

  }catch(error){
    console.log(error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return res;
}

export const fetchInstructorCourses = async(token)=>{
  const toastId = toast.loading("loading...");
  let res  = null;
  try{

    const response = await apiConnector("GET" , courseEndpoints.GET_ALL_INSTRUCTOR_COURSES_API , {}, {Authorization: `Bearer ${token}`})

    if(!response.data.success){
      throw new Error(response.data.message);
    }

    res = response.data.data;

  }catch(error){
    console.log(error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return res;
}

export const deleteCourse = async(data , token)=>{
  const toastId = toast.loading("loading...");
  let res  = null;  try{

    const response = await apiConnector("POST" , courseEndpoints.DELETE_COURSE_API , data, {Authorization: `Bearer ${token}`})

    if(!response.data.success){
      throw new Error(response.data.message);
    }


  }catch(error){
    console.log(error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
}

export const markLectureAsComplete = async(data , token)=>{
  const toastId = toast.loading('loading...');
  let result = []
  try{

    const res = await apiConnector("POST" , courseEndpoints.LECTURE_COMPLETION_API , data ,{Authorization: `Bearer ${token}`} );

    if(!res.data.success){
      throw new Error(res.data.message);
    }

    toast.success("Lecture completed");
    result = res;

  } catch(error){
    toast.error(error.message);
    console.log(error);
  }
  toast.dismiss(toastId);

  return result;
}