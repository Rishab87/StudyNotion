import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../../../services/operations/profileAPI';
import ProgressBar from '@ramonak/react-progress-bar';
import { useNavigate } from 'react-router-dom';

const EnrolledCourses = () => {

  const {token} = useSelector(state => state.auth);
  const [enrolledCourses , setEnrolledCourses] = useState(null);

  const getEnrolledCourses = async()=>{
    try{
      const response = await getUserEnrolledCourses(token);
      setEnrolledCourses(response);
    } catch(error){
      console.log(error.message);
    }
  }

  useEffect(()=>{
      getEnrolledCourses();
  } ,[]);

  const navigate = useNavigate();
  console.log(enrolledCourses);
  return (
    <div>

        <div>Enrolled Courses</div>
        {
          !enrolledCourses? (<div>
            Loading...
          </div>): enrolledCourses.length== 0? (<p>You have not enrolled in any course</p>):
          (
            <div>
              <div>
                <p>Course Name</p>
                <p>Durations</p>
                <p>Progress</p>
              </div>
              {
                enrolledCourses.map((course , index)=>(
                  <div className='cursor-pointer' key={index} onClick={()=> navigate(`/view-course/${course._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`)}>
                    <div>
                      <img src={course.thumbnail} alt="course-thumbnail" />
                      <div>
                        <p>{course.courseName}</p>
                        <p>{course.courseDescription.substring(0,50)}</p>
                      </div>
                    </div>

                    <div>
                      {course?.totalDuration}
                    </div>

                    {/* <div>
                      <p>Progress: {course.progressPercentage || 0}</p>
                      <ProgressBar completed={course.progressPercentage || 0}
                        height='8px'
                        isLabelVisible = {false}
                      />
                    </div> */}

                  </div>
                ))
              }
            </div>
          )
        }
    </div>
  )
}

export default EnrolledCourses