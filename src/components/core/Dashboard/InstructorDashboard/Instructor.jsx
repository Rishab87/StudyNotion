import React, { useState , useEffect } from 'react'
import { useSelector } from 'react-redux';
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import { getInstrcutrorDashboardData } from '../../../../services/operations/profileAPI';
import { Link } from 'react-router-dom';
import InstructorChart from './InstructorChart';

const Instructor = () => {

    const [loading , setLoading] = useState(false);
    const [instructorData , setInstructorData] = useState(null);
    const [courses , setCourses] = useState([]);  

    const {token} = useSelector(state=> state.auth);
    const {user} = useSelector(state=> state.profile);

    useEffect(()=>{
        const getInstructorCourses = async()=>{
            setLoading(true);
            const instructorApiData = await getInstrcutrorDashboardData(token);
            const result = await fetchInstructorCourses(token);

            console.log(instructorApiData.data);
            console.log(result);
            
            setInstructorData(instructorApiData.data);
            
            setCourses(result);
            

            setLoading(false);
        }

        getInstructorCourses();
    } , []);

    const totalAmount = instructorData?.reduce((acc , curr)=> acc + curr.totalAmountEarned
    , 0);
    console.log(totalAmount);
    const totalStudents = instructorData?.reduce((acc , curr)=> acc + curr.totalStudentsEnrolled , 0);

  return (
    <div className='text-white'>
        <div>
            <h1>Hi {user.firstName}</h1>
            <p>Lets start something new</p>
        </div>

        {loading? (<div>Loading...</div>):courses.length> 0 ?(
            <div>
                <div>
                    <InstructorChart courses={instructorData}/>
                    <div>
                        <p>Statistics</p>
                        <div>
                            <p>Total Courses</p>
                            <p>{courses.length}</p>
                        </div>

                        <div>
                            <p>Total Students</p>
                            <p>{totalStudents}</p>
                        </div>

                        <div>
                            <p>Total Income</p>
                            <p>{totalAmount}</p>
                        </div>
        
                    </div>
                </div>

                <div>
                    <div>
                        <p>Your Courses</p>
                        <Link to='/dashboard/my-courses'>
                            <p>View All</p>
                        </Link>
                    </div>
                    <div>
                        {
                            courses.slice(0 , 3).map((course , index)=>{
                                <div key={index}>
                                    <img src={course.thumbnail}/>
                                    <div>
                                        <p>{course.courseName}</p>
                                        <div>
                                            <p>{course.studentsEnrolled.length} students</p>
                                            <p>|</p>
                                            <p>Rs. {course.price}</p>
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </div>

            </div>
        ):(
            <div>
                <p>You have not created any courses yet</p>
                <Link to={"/dashboard/addCourse"}>
                    Create a Course
                </Link>
            </div>
        )}
    </div>
  )
}

export default Instructor