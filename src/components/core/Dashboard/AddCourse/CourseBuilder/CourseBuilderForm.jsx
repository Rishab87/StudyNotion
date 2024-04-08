import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import IconBtn from '../../../../common/IconBtn';
import { MdAddCircleOutline } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { BiRightArrowCircle } from "react-icons/bi";
import toast from 'react-hot-toast';
import {updateSection , createSection} from '../../../../../services/operations/courseDetailsAPI'
import NestedView from './NestedView';
import { setCourse  ,setEditCourse ,setSteps } from '../../../../../slices/courseSlice';

const CourseBuilderForm = () => {

  const {
    register , 
    handleSubmit , 
    setValue ,
    formState:{errors}
  } = useForm();

  const [editSectionName , setEditSectionName] = useState(false);
  const [loading , setLoading] = useState(false);

  const {course} = useSelector(state=> state.addCourse);
  const {token} = useSelector(state=> state.auth);

  const dispatch = useDispatch();

  const goBack = ()=>{
    dispatch(setSteps(1));
    dispatch(setEditCourse(true));
  }

  const goToNext = ()=>{
    if(course.courseContent.length == 0){
      toast.error("Please add at least 1 section");
      return;
    }

    if(course.courseContent.some(section => section.subSection.legnth === 0)){
      toast.error("Please add at least one lecture in each section");
      return;
    }

    dispatch(setSteps(3));
  }

  const handleChangeEditSectionName = (sectionId , sectionName)=>{
    if(editSectionName === sectionId){
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName" , sectionName);
  }

  const submitHandler = async(data)=>{
    setLoading(true);
    let result;

    if(editSectionName){
      result = await updateSection({
        sectionName: data.sectionName,
        sectionId: editSectionName,
      } , token);
      console.log(result);
      if(result){
        let updatedCourseContent = course.courseContent.map((section)=>{
          return section._id === editSectionName? result: section
        });
        console.log(updatedCourseContent);
        const updatedCourse = {...course , courseContent: updatedCourseContent};
        console.log(updatedCourse);
        dispatch(setCourse(updatedCourse));
      }
      return;
    }
    
    result = await createSection({
      sectionName: data.sectionName,
      courseId: course._id,
    } , token);

    if(result){
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName" , "");
    }
    setLoading(false);
  }

  const cancelEdit = ()=>{
    setEditSectionName(false);
    setValue("sectionName" , "");
  }

  return (
    <div>
      <p>Course Builder</p>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div>
          <label htmlFor="secName">Section name</label>
          <input type="text" id='secName' placeholder='Enter section name' {...register("sectionName" ,  {required: true})} className='w-full'/>
          {
            errors.sectionName && (
              <span>Section name is required*</span>
            )
          }
        </div>

        <div className='mt-10 flex'>
          <IconBtn type={"Submit"} 
           text={editSectionName? "Edit Section Name" : "Create Section"}
           outline={true}
           customClasses={"text-white"}
           >
            <MdAddCircleOutline className='text-yellow-50' size={20}/>
          </IconBtn>

          {
            editSectionName && (
              <button type='button' onClick={cancelEdit} className='text-sm text-richblack-300 underline'>
                Cancel Edit
              </button>
            )
          }
        </div>
      </form>

      {
        course.courseContent.length > 0 && (
          <NestedView handleChangeEditSectionName=  {handleChangeEditSectionName}/>
        )
      }

      <div className='flex justify-end gap-x-3'>
        <button onClick={goBack} className='rounded-md flex items-center justify-center'>
          Back
        </button>

        <IconBtn text={"Next"} onclick={goToNext}>
          <BiRightArrowCircle/>
        </IconBtn>
      </div>
      
    </div>
  )
}

export default CourseBuilderForm