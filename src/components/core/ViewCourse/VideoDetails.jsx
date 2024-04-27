import React, { useEffect, useRef , useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';
import { Player } from 'video-react';
// import '~video-react/dist/video-react.css'; // import css
import { AiFillPlayCircle } from 'react-icons/ai';
import IconBtn from '../../common/IconBtn';
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';

const VideoDetails = () => {

    const {courseId , sectionId , subSectionId} = useParams();
    const navigate = useNavigate();
    const dipatch = useDispatch();
    const playerRef = useRef();
    const {token} = useSelector(state=> state.auth);
    const {completedLectures , courseSectionData , courseEntireData} = useSelector(state=> state.course);

    const [videoData , setVideoData] = useState([]);
    const [loading , setLoading] = useState(false);
    const [videoEnded , setVideoEnded] = useState(false);

    const dispatch = useDispatch();

    const location = useLocation();

    useEffect(()=>{
        const setVideoSpecificDetails = async()=>{
            if(!courseSectionData?.length)
                return;
        }

        if(!courseId && !sectionId && !subSectionId){
            navigate('/dashboard/enrolled-courses');
        }
        else{
            const filteredData = courseSectionData.filter(section=> section._id === sectionId);
            const filteredVideoData = filteredData[0]?.subSection.filter(subSection=> subSection._id === subSectionId);

            setVideoData(filteredVideoData?.[0]);
            setVideoEnded(false);
        }
    } , [location.pathname , courseSectionData , courseEntireData])

    const isFirstVideo = ()=>{
        const currentSectionIndex = courseSectionData.findIndex((data)=> data._id === sectionId);

        const subSectionIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex(data=> data._id === subSectionId);

        if(currentSectionIndex === 0 && subSectionIndex === 0)
            return true;

        return false;
    }

    const isLastVideo = ()=>{

        const currentSectionIndex = courseSectionData.findIndex((data)=> data._id === sectionId);

        const subSectionIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex(data=> data._id === subSectionId);

        const noOfSubSections = courseSectionData[currentSectionIndex]?.subSection.length;


        if(currentSectionIndex === courseSectionData.length -1 && subSectionIndex ===  noOfSubSections -1)
            return true;

        return false;

    }

    const goToNextVideo = ()=>{
        const currentSectionIndex = courseSectionData.findIndex((data)=> data._id === sectionId);

        const subSectionIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex(data=> data._id === subSectionId);

        const noOfSubSections = courseSectionData[currentSectionIndex]?.subSection.length;

        if(subSectionIndex != noOfSubSections -1){
            // same section ki next vid
            const nextSubSectionId = courseSectionData[currentSectionIndex]?.subSection?.[subSectionIndex + 1]?._id;
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`);
        }
        else{
            const nextSectionId = courseSectionData[currentSectionIndex + 1]?._id;
            const nextSubSectionId = courseSectionData[currentSectionIndex + 1]?.subSection?.[0]?._id;

            navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`);
        }
    }

    const goToPreviousVideo = ()=>{
        const currentSectionIndex = courseSectionData.findIndex((data)=> data._id === sectionId);

        const subSectionIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex(data=> data._id === subSectionId);

        const noOfSubSections = courseSectionData[currentSectionIndex]?.subSection.length;

        if(subSectionIndex != 0){
            // same section ki next vid
            const nextSubSectionId = courseSectionData[currentSectionIndex]?.subSection?.[subSectionIndex -1]?._id;
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`);
        }
        else{
            const prevSectionId = courseSectionData[currentSectionIndex -1]?._id;
            const prevSubSectionLength = courseSectionData[currentSectionIndex -1]?.subSection.length;
            const prevSubSectionId = courseSectionData[currentSectionIndex - 1]?.subSection?.[prevSubSectionLength-1]?._id;

            navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`);
        }
    }

    const handleLectureCompletion = async()=>{
        setLoading(true);

        //write markLectureAsComplete function
        const res = await markLectureAsComplete({courseId , subSectionId} , token);

        if(res){
            dispatch(updateCompletedLectures(res));
            // setVideoEnded(true);
        }

        setLoading(false);
    }

  return (
    <div className='h-[100vh] w-[60vw] flex flex-col gap-3 text-white font-bold'>
        {
            !videoData ? (
                <div>No Data Found</div>
            ) :(
                <Player aspectRatio='16:9' ref={playerRef} playsInline onEnded = {()=> setVideoEnded(true)} src={videoData.videoUrl}>
                        <AiFillPlayCircle/>
                        {
                            videoEnded && (
                                <div>
                                    {
                                        !completedLectures.includes(subSectionId) && !isLastVideo && (
                                            <IconBtn
                                                disabled={loading}
                                                onclick = {()=> handleLectureCompletion()}
                                                text={loading? "Loading...": "Mark as Complete"}
                                            />
                                        )
                                    }

                                    <IconBtn 
                                    disabled={loading}
                                    onclick={()=>{
                                        if(playerRef.current){
                                            playerRef.current.seek(0);
                                            setVideoEnded(false);
                                        }
                                    }}
                                    text={"Rewatch"}
                                    customClasses={"text-xl"}
                                    />

                                    <div>
                                        {
                                            !isFirstVideo() && (
                                                <button 
                                                    disabled={loading}
                                                    onClick={()=> goToPreviousVideo()}
                                                    customClasses={"blackButton"}
                                                >
                                                Prev
                                                </button>
                                            )
                                        }

                                        {
                                            !isLastVideo() && (
                                                <button 
                                                    disabled={loading}
                                                    onClick={()=> goToNextVideo()}
                                                    customClasses={"blackButton"}
                                                >
                                                Next
                                                </button>
                                            )
                                        }
                                    </div>
                                </div>
                            )
                        }

                    
                </Player>
            )
        }
        <h1>{videoData?.title}</h1>
        <p>{videoData?.description}</p>
    </div>
  )
}

export default VideoDetails