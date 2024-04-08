import React, { useState } from 'react'
import {useDispatch, useSelector } from 'react-redux'
import { Table, Tbody, Thead ,Tr , Td ,Th } from 'react-super-responsive-table';
import { COURSE_STATUS } from '../../../../utils/constants';
import ConfirmationModal from '../../../common/ConfirmationModal';
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { setCourse } from '../../../../slices/courseSlice';
import { useNavigate } from 'react-router-dom';

const CoursesTable = ({courses , setCourses}) => {

    const dispatch = useDispatch();
    const {token} = useSelector(state=> state.auth);
    const [loading , setLoading] = useState(false);
    const [confirmationModal , setConfirmationModal] = useState(null);

    const handleCourseDelete = async(courseId)=>{
        setLoading(true);

        await deleteCourse({courseId: courseId} , token);

        const result = await fetchInstructorCourses(token);
        if(result){
            console.log(courses);
        }

        setConfirmationModal(null);
        setLoading(false);
    }

    const navigate = useNavigate();

  return (
    <div>
        <Table>
            <Thead>
                <Tr>
                    <Th>
                        Courses
                    </Th>
                    <Th>
                        Duration
                    </Th>
                    <Th>
                        Prices
                    </Th>
                    <Th>
                        Actions
                    </Th>
                </Tr>
            </Thead>

            <Tbody>
                {
                    courses.length === 0 ? (
                        <Tr>
                            <Td>
                                No Courses Found
                            </Td>
                        </Tr>
                    ):
                    (
                        courses.map((course)=>(
                            <Tr key = {course._id} className= 'flex gap-x-10 border-richblack-800 p-8'>
                                <Td className='flex gap-x-4'>
                                    <img src={course?.thumbnail} alt="thumbnail" className='h-[150px] w-[220px] rounded-lg object-cover' />
                                    <div className='flex flex-col'>
                                        <p>{course.courseName}</p>
                                        <p>{course.courseDescription}</p>
                                        <p>Created: </p>
                                        {
                                            course.status === COURSE_STATUS.DRAFT ? (
                                                <p>DRAFTED</p>
                                            ):(
                                                <p>PUBLISHED</p>
                                            )
                                        }
                                    </div>
                                </Td>
                                <Td>
                                    2 hr 30 min {/*change it */}
                                </Td>
                                <Td>
                                    {course.price}
                                </Td>
                                <Td>
                                    <button disabled={loading} onClick={()=>{
                                        dispatch(setCourse(course));
                                        navigate(`/dashboard/edit-course/${course._id}`);

                                    }}>
                                        EDIT
                                    </button>

                                    <button disabled=  {loading}
                                    onClick={()=>{
                                        setConfirmationModal({
                                            text1: "Do you want to delete this course?",
                                            text2: "All the data related to this course will be deleted",
                                            btn1Text: "Delete",
                                            btn2Text: "Cancel",
                                            btn1Handler: !loading ? ()=> handleCourseDelete(course._id): ()=>{},
                                            btn2Handler: !loading? ()=>setConfirmationModal(null): ()=>{},
                                        })
                                    }}>
                                    Delete
                                    </button>
                                </Td>
                            </Tr>
                        ))
                    )
                }
            </Tbody>
        </Table>
        {
            confirmationModal && <ConfirmationModal modalData={confirmationModal}/>
        }
    </div>
  )
}

export default CoursesTable