import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { fetchCourseDetails } from '../services/operations/courseDetailsAPI';
import { setCourseSectionData , setCompletedLectures, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice';
import ViewDetailsSidebar from '../components/core/ViewCourse/ViewDetailsSidebar'
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal';

const ViewCourse = () => {

  const [reviewModal , setReviewModal] = useState(false);
  const {courseId} = useParams();
  const {token} = useSelector(state=> state.auth);
  const {user} = useSelector(state=> state.profile);
  const dispatch = useDispatch();
  const [loading , setLoading] = useState(false);

  useEffect(()=>{
    const setCourseSpecificDetails = async()=>{
      setLoading(true);
      const courseData = await fetchCourseDetails(courseId , token);
      console.log(courseData);
      dispatch(setCourseSectionData(courseData.data.courseContent));
      dispatch(setEntireCourseData(courseData.data));
      dispatch(setCompletedLectures(courseData.courseProgressCount === undefined? []: courseData.courseProgressCount));
      let lectures = 0;
      console.log(courseData);
      courseData.data.courseContent.forEach(section => {
        lectures += section.subSection.length;
      });
      dispatch(setTotalNoOfLectures(lectures));
      setLoading(false);
    }

    setCourseSpecificDetails();
  } , []);

  if(loading){
    return (
      <p>Loading...</p>
    )
  }

  return (

    <div className='h-[100vh] overflow-y-auto w-[100vw] flex'>
          <ViewDetailsSidebar setReviewModal={setReviewModal}/>
          <div>
            <Outlet/>
          </div>
          {reviewModal && <CourseReviewModal setReviewModal={setReviewModal}/>}
    </div>
  )
}

export default ViewCourse