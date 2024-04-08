import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';
import CoursesTable from './InstructorCourses/CoursesTable';
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI';

const MyCourses = () => {

    const {token} = useSelector(state=> state.auth);
    const navigate= useNavigate();
    const [courses , setCourses] = useState([]);
    const dispatch = useDispatch();

    useEffect(()=>{
        const fetchedCourses = async()=>{
            const result = await fetchInstructorCourses(token);
            if(result){
                setCourses(result);
            }
        }
        fetchedCourses();
    } , [])

  return (
    <div>
        <div>
            <h1>My Courses</h1>
            <IconBtn
                text={"Add Course"}
                onclick={()=> navigate('/dashboard/add-course')}
            />
        </div>

        {
            courses && <CoursesTable courses= {courses} setCourses = {setCourses}/>
        }
    </div>
  )
}

export default MyCourses