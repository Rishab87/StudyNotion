import React, { useEffect, useState } from 'react'
import {useSelector , useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { buyCourse } from '../../../../services/operations/studentFeaturesAPI';
import {useParams} from 'react-router-dom';
import { fetchCourseDetails } from '../../../../services/operations/courseDetailsAPI';
import toast from 'react-hot-toast';
import GetAvgRating from '../../../../utils/avgRating';
import Error from '../../../../pages/Error'
import ConfirmationModal from '../../../common/ConfirmationModal';
import RatingStars from '../../../common/RatingStars';
import {formatDate} from '../../../../services/formatDate';
import CourseDetailsCard from '../../Course/CourseDetailsCard';

//move file to pages folder
const BuyCourse = () => {

    const {token} = useSelector(state => state.auth);
    const {user , loading} = useSelector(state => state.profile);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const courseId = useParams().id;

    const [courseData , setCourseData] = useState(null);
    const [confirmationModal , setConfirmationModal] = useState(false); 


    const [isActive , setIsActive] = useState([]);
    const handleActive = (id)=>{
      setIsActive(!isActive.includes(id)? isActive.concat(id): isActive.filter((item)=> item !== id));
    }

    useEffect(()=>{

      const getCourseDetails = async()=>{
        try{
          const res = await fetchCourseDetails(courseId);
          setCourseData(res);
        } catch(error){
            toast.error("Unable to fetch courses");
        }
      }

      getCourseDetails();

    } , [courseId]);

    const [avgReviewCount , setAverageReviewCount] = useState(0); 

    useEffect(()=>{
      const count = GetAvgRating(courseData?.data?.ratingAndReview); 
      setAverageReviewCount(count);
    } , [courseData]);

    const [totalNoOfLecture , setTotalNoOfLecture] = useState(0);
    useEffect(()=>{
      let lectures = 0;
      courseData?.data?.courseContent.forEach((section)=>{
        lectures += section.subSection.length || 0;
      });
      setTotalNoOfLecture(lectures);
    } , [courseData]);

    if(loading || !courseData){
      return (
        <div>
          Loading...
        </div>
      )
    }
    console.log(courseData.data);
    if(!courseData.success){
        return (
          <Error/>
        )
    }

    const handleBuyCourse = ()=>{
      if(token){
        buyCourse(token , [courseId] , user , navigate , dispatch);
      }
      else{
        setConfirmationModal({
          text1: "You are not logged in",
          text2: "Please login to purchase the course",
          btn1Text: "Login",
          btn2Text: "Cancel",
          btn1Handler: ()=> navigate('/login'),
          btn2Handler: ()=> setConfirmationModal(false)
        });
      }
    }

    const {
      _id: course_id,
      courseName,
      courseDescription,
      thumbnail,
      price,
      whatYouWillLearn,
      courseContent,
      ratingAndReview,
      instructor,
      studentsEnrolled,
      createdAt,
    } = courseData.data;

    console.log(courseData);

  return (
    <div className=' h-fit flex flex-col items-center text-white'>

      <div className='relative flex items-center justify-start flex-col'>
        <p>{courseName}</p>
          <p>{courseDescription}</p>
          <div>
            <span>{avgReviewCount}</span>
            <RatingStars Review_Count={avgReviewCount} Star_Size={24}/>
            <span>{`(${ratingAndReview.length} reviews) `}</span>
            <span>{`${studentsEnrolled.length} students enrolled`}</span>
          </div>

          <div>
            <p>Created By {`${instructor.firstName}`}</p>
          </div>

          <div className='flex gap-x-3'>
            <p>
              Created At {formatDate(createdAt)}
            </p>

            <p>English</p> {/*add language in models and in creaete course */}
          </div>

          <div>
            <CourseDetailsCard course = {courseData?.data} setConfirmationModal=  {setConfirmationModal} handleBuyCourse = {handleBuyCourse}/>

          </div>

          <div>
            <p>What You Will Learn</p>
            <div>
              {whatYouWillLearn}
            </div>
          </div>

          <div>
            <div>
              <p>Course Content</p>
            </div>
            <div>
              <span>{courseContent.length} section(s)</span>
              <span>{totalNoOfLecture} lectures</span>
              <span>{courseData.totalDuration}</span>
            </div>
            {/*Add total duration after adding in sub-section schema and find a way to find length of videos to send to backend*/}

            <div>
            {/*Hw add courseContent  */}
              <button onClick={()=> setIsActive([])}>
                Collapse all sections
              </button>
            </div>
          </div>


          {confirmationModal && <ConfirmationModal modalData = {confirmationModal}/>}
      </div>
    </div>
  )
}

export default BuyCourse