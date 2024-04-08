import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RenderSteps from '../AddCourse/RenderSteps';
import { setEditCourse } from '../../../../slices/courseSlice';

const EditCourse = () => {

    const dispatch = useDispatch();
    const {course} = useSelector(state=>state.addCourse);
    const {token} = useSelector(state=>state.auth);

    useEffect(()=>{
        dispatch(setEditCourse(true));
    } , []);

  return (
    <div>
        <h1>Edit Course</h1>
        <div>
            {
                course? (<RenderSteps/>): (<p>Course Not Found</p>)
            }
        </div>
    </div>
  )
}

export default EditCourse