import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';
import ProgressBar from "@ramonak/react-progress-bar";

const ViewDetailsSidebar = ({setReviewModal}) => {

    const [activeStatus , setActiveStatus] = useState("");
    const [videobarActive , setVideoBarActive] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const {sectionId , subSectionId} = useParams();
    const {
        courseSectionData , 
        courseEntireData ,
        totalNoOfLectures , 
        completedLectures,
    } = useSelector(state=> state.course);


    useEffect(()=>{
        ;(()=>{
            if(!courseSectionData?.length)
                return;
            const currentSectionIndex = courseSectionData.findIndex(
                data=> data._id === sectionId
            );

            const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.findIndex(
                data => data._id === subSectionId
            );

            const activeSubSectionId = courseSectionData[currentSectionIndex]?.subSection?.[currentSubSectionIndex]?._id;

            //set current sec and sub sec
            setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
            setVideoBarActive(activeSubSectionId);
        })()
    } ,[location.pathname , courseEntireData , courseSectionData] );

    console.log(courseSectionData)
    // console.log((completedLectures.length/totalNoOfLectures)*100)

  return (
    <>
        <div className='text-white h-[100vh] w-[30vw]'>
            <div className='h-full flex flex-col gap-7 w-full'>
                <div className=' flex flex-col gap-7'>
                    <div onClick={()=> navigate('/dashboard/enrolled-courses')}>
                        Back{/*add back btn icon */}
                    </div>
                    <div>
                        <IconBtn 
                        text={"Add Review"}
                        onclick={()=> setReviewModal(true)}
                        />
                    </div>
                    <ProgressBar completed={(completedLectures.length/totalNoOfLectures)*100}/>
                </div>

                <div>
                    <p>{courseEntireData?.courseName}</p>
                    <p>{completedLectures.length}/{totalNoOfLectures}</p>
                </div>
            </div>

            <div className='text-white w-full h-full'>
                {
                    courseSectionData.map((course , index)=>(
                        <div key={index} onClick={()=> setActiveStatus(course?._id)}>

                            <div>
                                <div>
                                    {course?.sectionName}
                                </div>
                                {/*add arrow icon and handle rotate 180 logic */}
                            </div>

                            <div>
                                {
                                    activeStatus === course?._id && (
                                        <div>
                                            {
                                                course.subSection.map((topic ,index)=>(
                                                    <div key={index} className={`flex gap-4 p-5 ${videobarActive == topic._id? "bg-yellow-50 text-richblack-900": " bg-richblack-900 text-white"}`} onClick={()=>{
                                                    navigate(`/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`);
                                                    setVideoBarActive(topic._id);
                                                    }}
                                                    >
                                                        <input type='checkbox' checked = {completedLectures.includes(topic._id)}/>
                                                        <span>{topic.title}</span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    </>
  )
}

export default ViewDetailsSidebar