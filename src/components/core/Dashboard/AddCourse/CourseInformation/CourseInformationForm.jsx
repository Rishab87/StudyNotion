import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseCategories } from '../../../../../services/operations/courseDetailsAPI';
import { HiCurrencyRupee } from "react-icons/hi";
import RequirementField from './RequirementField';
import {setCourse, setSteps} from '../../../../../slices/courseSlice'
import IconBtn from '../../../../common/IconBtn'
import toast from 'react-hot-toast';
import {COURSE_STATUS} from '../../../../../utils/constants'
import ChipInput from './ChipInput';
import Thumbnail from './Thumbnail';
import { addCourseDetails , editCourseDetails } from '../../../../../services/operations/courseDetailsAPI';

const CourseInformationForm = () => {

    const {
        register , 
        handleSubmit , 
        setValue , 
        getValues,
        formState: {errors},
    } = useForm();

    const dispatch = useDispatch();

    const {course , editCourse} = useSelector(state=> state.addCourse);
    const {token} = useSelector(state=> state.auth);
    const [loading , setLoading] = useState(false);

    const [courseCategories , setCourseCategories] = useState([]);

    useEffect(()=>{
        const getCategories = async()=>{
            setLoading(true);
            const categories = await fetchCourseCategories();
            if(categories.length>0){
              setCourseCategories(categories);
            }
            setLoading(false);
        }


        if(editCourse){
          setValue("courseTitle" , course.courseName);
          setValue("courseShortDesc" , course.courseDescription);
          setValue("coursePrice" , course.price);
          setValue("courseCategory" , course.category);
          setValue("courseTags" , course.tag);
          setValue("courseBenefits" , course.whatYouWillLearn);
          setValue("courseRequirements" , course.instructions);
          setValue("courseImage" , course.thumbnail);
        }
 
        getCategories();
    } , []);

    const isFormUpdated = ()=>{
      const currentValues = getValues();
      if(currentValues.courseTitle !== course.courseName
        || currentValues.courseShortDesc !== course.courseDescription ||
        currentValues.coursePrice !== course.price||
        currentValues.courseTags.toString() !== course.tag.toString()||
        currentValues.courseBenefits !== course.whatYouWillLearn||
        currentValues.courseCategory !== course.category._id ||
        currentValues.courseImage !== course.thumbnail ||
        currentValues.courseRequirements.toString() !== course.instructions.toString())
        return true;
      else
        return false;
    }

    //handles next btn click
    const submitHandler = async(data)=>{
      if(editCourse){
        if(isFormUpdated()){
          const currentValues = getValues();
          const formData = new FormData();
  
          formData.append("courseId" , course._id);
          if(currentValues.courseTitle !== course.courseName){
            formData.append("courseName" , data.courseTitle)
          }
          if(currentValues.courseShortDesc !== course.Description){
            formData.append("courseDescription" , data.courseShortDesc)
          }
          if(currentValues.coursePrice !== course.price){
            formData.append("price" , data.coursePrice)
          }
          if(currentValues.courseBenefits !== course.whatYouWillLearn){
            formData.append("whatYouWillLearn" , data.courseBenefits)
          }
          if(currentValues.courseCategory._id !== course.category._id){
            formData.append("category" , data.courseCategory)
          }
          if(currentValues.courseRequirement.toString() !== course.instructions.toString()){
            formData.append("instructions" , JSON.stringify(data.courseRequirements))
          }
          //add tags , thumbnail
  
          setLoading(true);
          const result = await editCourseDetails(formData , token);
          setLoading(false);
          if(result){
            dispatch(setSteps(2));
            dispatch(setCourse(result));
          }
  
        } else{
          toast.error("No changes made to the form");
        }
        return;
      }

      console.log(data);
      const formData = new FormData();
      formData.append("courseName" , data.courseTitle);
      formData.append("courseDescription" , data.courseShortDesc);
      formData.append("price" , data.coursePrice);
      formData.append("whatYouWillLearn" , data.courseBenefits);
      formData.append("category" , data.courseCategory);
      formData.append("instructions" , JSON.stringify(data.courseRequirements));
      formData.append("tag" , data.courseTags);
      formData.append("thumbnailImage" , data.courseImage[0]);
      formData.append("status" , COURSE_STATUS.DRAFT);
      console.log(formData);

      setLoading(true);
      const result = await addCourseDetails(formData , token);
      if(result){
        dispatch(setSteps(2));
        dispatch(setCourse(result));
      }
      setLoading(false);
    }

  return (
    <form onSubmit={handleSubmit(submitHandler)} className='rounded-md border-richblack-700 bg-richblack-800 p-6 space-y-8'>
      <div>
        <label htmlFor="courseTitle">Course Title <sup>*</sup></label>
        <input type="text" id='courseTitle' placeholder='Enter Course Title' {...register("courseTitle" , {required:true})} className='w-full'/>
        {
          errors.courseTitle && (
            <span>Course Title is required*</span>
          )
        }
      </div>

      <div>
        <label htmlFor="courseShortDesc">Course Short Description</label>
        <textarea id="courseShortDesc" placeholder='Enter Description' {...register("courseShortDesc" , {required:true})} className='min-h-[140px] w-full'/>
        {
          errors.courseShortDesc && (
            <span>Course Description is required*</span>
          )
        }
      </div>

      <div className='relative'>
        <label htmlFor="coursePrice">Course Price <sup>*</sup></label>
        <input type="number" id='coursePrice' placeholder='Enter Course Price' {...register("coursePrice" , {required:true , valueAsNumber: true})} className='w-full'/>
        <HiCurrencyRupee className='absolute top-1/2 text-richblack-400'/>
        {
          errors.coursePrice && (
            <span>Course Price is required*</span>
          )
        }
      </div>

      <div>
        <label htmlFor='courseCategory'>Course Category <sup>*</sup></label>
        <select id="courseCategory" defaultValue={""} {...register("courseCategory" , {required:true})}>
          <option value="" disabled>Choose a Category</option>
          {
            !loading &&
            courseCategories.map((category , index)=>(
              <option key={index} value={category?._id}>{category?.name}</option>
            ))
          }
        </select>
        {
          errors.courseCategory && (
            <span>
              Course Category is Required
            </span>
          )
        }
      </div>

      {/*HW: create a custom component for handling tags input comma dekr ya enter krne pr tag add honge
      HW: Create Upload component */}

      <ChipInput 
      register = {register}
      label = {"Tags"}
      errors = {errors}
      setValue = {setValue}
      name = {"courseTags"}
      />

      <Thumbnail
        register = {register}
        label  = {"Thumbnail"}
        errors = {errors}
        setValue = {setValue}
        name = {"courseImage"}
        getValues = {getValues}
      />

      <div>
        <label htmlFor="courseBenefits">Benefits of the course <sup>*</sup></label>
        <textarea id="courseBenefits" placeholder='Enter Benefits of the course' {...register("courseBenefits" , {required:true})} className='min-h-[130px] w-full'/>
        {
          errors.courseBenefits && (
            <span>Benefits of the course are required</span>
          )
        }
      </div>

      <RequirementField name = "courseRequirements" label = "Requirements/Instructions" register= {register} errors = {errors} setValue = {setValue} getValues = {getValues}/>
      
      <div>
        {
          editCourse && (
            <button onClick={()=> dispatch(setSteps(2))} className='flex items-center gap-x-2 bg-richblack-300'>
              Continue Without Saving
            </button>
          )
        }

        <IconBtn
          text={!editCourse? "Next": "Save Changes"}
        />
  
      </div>
    </form>
  )
}

export default CourseInformationForm