import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import IconBtn from '../../../../common/IconBtn';
import { MdAddCircleOutline } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { BiRightArrowCircle } from "react-icons/bi";
import { IoAddCircleOutline } from "react-icons/io5"
import { MdNavigateNext } from "react-icons/md"
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
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
    <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="sectionName">
          Section Name <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="sectionName"
          disabled={loading}
          placeholder="Add a section to build your course"
          {...register("sectionName", { required: true })}
          className="form-style w-full"
        />
        {errors.sectionName && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Section name is required
          </span>
        )}
      </div>
      <div className="flex items-end gap-x-4">
        <IconBtn
          type="submit"
          disabled={loading}
          text={editSectionName ? "Edit Section Name" : "Create Section"}
          outline={true}
        >
          <IoAddCircleOutline size={20} className="text-yellow-50" />
        </IconBtn>
        {editSectionName && (
          <button
            type="button"
            onClick={cancelEdit}
            className="text-sm text-richblack-300 underline"
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
    {course.courseContent.length > 0 && (
      <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
    )}
    {/* Next Prev Button */}
    <div className="flex justify-end gap-x-3">
      <button
        onClick={goBack}
        className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
      >
        Back
      </button>
      <IconBtn disabled={loading} text="Next" onclick={goToNext}>
        <MdNavigateNext />
      </IconBtn>
    </div>
  </div>
  )
}

export default CourseBuilderForm