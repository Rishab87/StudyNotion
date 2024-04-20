import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { fetchCourseDetails } from '../services/operations/courseDetailsAPI';
import { setCourseSectionData , setCompletedLectures, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice';


const ViewCourse = () => {

  const [reviewModal , setReviewModal] = useState(false);
  const {courseId} = useParams();
  const {token} = useSelector(state=> state.auth);
  const {user} = useSelector(state=> state.profile);
  const dispatch = useDispatch();

  useEffect(()=>{
    const setCourseSpecificDetails = async()=>{
      const courseData = await fetchCourseDetails(courseId , token);
      dispatch(setCourseSectionData(courseData.data.courseContent));
      dispatch(setEntireCourseData(courseData.data));
      // dispatch(setCompletedLectures(user.courseProgress.completedVideos));
      let lectures = 0;
      courseData.data.courseContent.forEach(section => {
        lectures += section.subSection.length;
      });
      dispatch(setTotalNoOfLectures(lectures));
    }

    setCourseSpecificDetails();
  } , [])

  return (
    <div>
          <ViewDetailsSidebar setReviewModal={setReviewModal}/>
          <div>
            <Outlet/>
          </div>
          {reviewModal && <CourseReviewModal setReviewModal={setReviewModal}/>}
    </div>
  )
}

export default ViewCourse