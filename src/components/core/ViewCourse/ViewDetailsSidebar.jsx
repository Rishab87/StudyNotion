import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const ViewDetailsSidebar = () => {

    const [activeStatus , setActiveStatus] = useState("");
    const [videobarActive , setVideoBarActive] = useState("");
    const navigate = useNavigate();
    const {sectionId , subSectionId} = useParams();
    const {
        courseSectionData , 
        courseEntireData ,
        totalNoOfLectures , 
        completedLectures,
    } = useSelector(state=> state.viewCourse);

    useEffect(()=>{
        ;(()=>{
            if(!courseSectionData.length)
                return;
            const currentSectionIndex = courseSectionData.findIndex(
                data=> data._id === sectionId
            );

            const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.findIndex(
                data => data._id === subSectionId
            );

            const activeSubSectionId = courseSectionData[currentSectionIndex]?.subSection?.[currentSectionIndex]?._id;
        })()
    })

  return (
    <div>

    </div>
  )
}

export default ViewDetailsSidebar