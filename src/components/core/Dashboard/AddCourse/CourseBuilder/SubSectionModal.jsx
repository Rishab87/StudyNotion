import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setCourse } from '../../../../../slices/courseSlice';
import { createSubSection ,updateSubSection } from '../../../../../services/operations/courseDetailsAPI';
import { RxCross1 } from 'react-icons/rx';
import Thumbnail from '../CourseInformation/Thumbnail'
import IconBtn from '../../../../common/IconBtn';

const SubSectionModal = ({
  modalData , 
  setModalData , 
  add = false,
  view = false,
  edit = false,
}) => {

  const {
    register , 
    handleSubmit , 
    setValue , 
    formState: {errors},
    getValues,
  } = useForm();

  const {course} = useSelector(state=> state.addCourse);
  const {token} = useSelector(state=> state.auth);
  const dispatch = useDispatch();
  const [loading , setLoading] = useState(false);

  useEffect(()=>{
    if(view || edit){
      setValue("lectureTitle" , modalData.title);
      setValue("lectureDesc" , modalData.description);
      setValue("lectureVideo" , modalData.videoUrl);
    }
  } , []);

  const isFormUpdated = ()=>{
    const currentValues = getValues();
    if(currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl){
        return true;
    }
    else{
      return false;
    }
  }

  const handleEditSubSection = async()=>{
    const currentValues = getValues();
    const formData = new FormData();

    formData.append("sectionId" , modalData.sectionId);
    formData.append("subSectionId" , modalData._id);

    if(currentValues.lectureTitle !== modalData.lectureTitle){
      formData.append("title" , currentValues.lectureTitle);
    }
    if(currentValues.lectureDesc !== modalData.lectureDesc){
      formData.append("description" , currentValues.lectureDesc);
    }
    if(currentValues.lectureVideo !== modalData.lectureVideo){
      formData.append("video" , currentValues.lectureVideo);
    }

    setLoading(true);
    
    const result = await updateSubSection(formData , token);
    if(result){
      const updatedCourseContent = course.courseContent.map((section)=>{
        return section._id === modalData.sectionId? result: section
      });
      console.log(updatedCourseContent);
      const updatedCourse = {...course , courseContent:updatedCourseContent};

      dispatch(setCourse(updatedCourse));
    }

    setModalData(null);
    setLoading(false);
  }

  const submitHandler = async(data)=>{

    if(view)
      return;
    if(edit){
      if(!isFormUpdated()){
        toast.error("No changes made to the form");
      }
      else{
        handleEditSubSection();
        return;
      }
    }

    const formData = new FormData();
    formData.append("sectionId" , modalData);
    formData.append("title" , data.lectureTitle);
    formData.append("description" , data.lectureDesc);
    formData.append("videoFile" , data.lectureVideo[0]);
    setLoading(true);

    const result = await createSubSection(formData , token);
    console.log(result);
    if(result){
      let updatedCourseContent = course.courseContent.map((section)=>{
        return section._id === modalData? result: section
      });

      const updatedCourse = {...course , courseContent: updatedCourseContent};
      dispatch(setCourse(updatedCourse));
    }
    setModalData(null);
    setLoading(false);
  }


  return (
    <div>

      <div>
        <div>
          <p>{view && "Viewing"}{add && "Adding"}{edit && "Editing"} Lecture</p>
          <button onClick={()=> (!loading ? setModalData(null): {})}>
            <RxCross1/>
          </button>
        </div>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Thumbnail
            name={"lectureVideo"}
            label={"Lecture Video"}
            register={register}
            setValue = {setValue}
            errors={errors}
            video= {true}
            viewData = {view? modalData.videoUrl: null}
            editData = {edit? modalData.videoUrl: null}
          />
          <div>
            <label htmlFor="lectureTitle">Lecture Title</label>
            <input type='text' id='lectureTitle' placeholder='Enter Lecture Title' {...register("lectureTitle" , {required:true})} className='w-full'/>
            {
              errors.lectureTitle && (
                <span>Lecture Title is Required*</span>
              )
            }
          </div>

          <div>
            <label htmlFor="lectureDescription">Lecture Description</label>
            <input type='text' id='lectureDescription' placeholder='Enter Lecture Description' {...register("lectureDesc" , {required:true})} className='w-full min-h-[130px]'/>
            {
              errors.lectureDesc && (
                <span>Lecture Description is Required*</span>
              )
            }
          </div>
          {
            !view && (
              <div>
                <IconBtn
                  type={'submit'}
                  text= {loading? "loading...": edit? "Save Changes": "Save"}
                />
              </div>
            )
          }
        </form>
      </div>

    </div>
  )
}

export default SubSectionModal