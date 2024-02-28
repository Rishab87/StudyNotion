import React, { useState } from 'react'
import {HomePageExplore} from '../../../data/homepage-explore'
import HighlighText from './HighlighText';
import CourseCard from './CourseCard';

const tabName = [
    "Free",
    "New to Coding",
    "Most Popular",
    "Skills Paths",
    "Career Paths",
];

const ExploreMore = () => {

    const [currentTab , setCurrentTab] = useState(tabName[0]);
    const [courses , setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard , setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyCards = (value)=>{
        setCurrentTab(value);
        const result = HomePageExplore.filter((course) => course.tag === value);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
    }

  return (
    <div className='text-white mx-auto w-11/12 flex items-center flex-col justify-between max-w-maxContent relative'>
        <div className='text-4xl font-semibold text-center'>
            Unlock the <HighlighText text={"Power of Code"}/>
        </div>

        <p className='text-center text-richblack-300 text-sm mt-3 text-[16px]'>
            Learn to Build Anything You Can Imagine
        </p>

        <div className='flex gap-2 rounded-full bg-richblack-800 mb-5 border-richblack-100 mt-5 px-1 py-1'>
            {
                tabName.map((element , index)=>{
                    return(
                        <div className={`text-[16px] flex items-center gap-2 
                        ${currentTab == element? "bg-richblack-900 text-richblack-5 font-medium":
                        "text-richblack-200"} rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblue-5 px-5 py-2`}
                        key={index} onClick={()=> setMyCards(element)}>
                            {element}
                        </div>
                    )
                })
            }
        </div>

        <div className='h-[150px] md:h-[10px] sm:h-[10px]'></div>

        <div className='flex justify-between items-center absolute gap-10 top-56 w-[80%] flex-col lg:flex-row md:relative sm:relative sm:top-24 md:top-24 sm'>
            {
                courses.map( (element , index)=>{
                    return( //hw: create course card
                        <CourseCard key={index} cardData = {element} currentCard = {currentCard} setCurrentCard = {setCurrentCard}/>
                    )
                }
                )
            }

        </div>
    </div>
  )
}

export default ExploreMore