import React from 'react'
import { IoMdPeople } from "react-icons/io";
import { ImTree } from "react-icons/im";

const CourseCard = ({cardData , currentCard , setCurrentCard}) => {
  return (
    <div onClick={() => setCurrentCard(cardData.heading)} className={`flex justify-evenly w-[25%] h-[230px] ${currentCard == cardData.heading? "bg-white shadow-[12px_12px_0px_0px_rgba(255,214,10,1)]":"bg-richblack-800"} p-3 cursor-pointer transition-all duration-200 min-w-[250px] `}>
 
            <div className='flex flex-col justify-between gap-3'>
              <div>
                <h3 className={`font-bold text-lg  ${currentCard == cardData.heading? "text-richblack-800":"text-richblack-25"}`}>{cardData.heading}</h3>
                <p className='text-richblack-500 text-sm'>{cardData.description}</p>
              </div>
              <div className={`${currentCard == cardData.heading? "text-richblue-500":"text-richblack-300"} flex justify-between border-t-2 border-dashed border-richblack-50 pt-3`}>
                <div className='flex justify-center gap-2 items-center'>
                  <IoMdPeople/> 
                  <p>{cardData.level}</p>
                </div>
                <div className='flex items-center justify-center gap-2'> 
                  <ImTree/>
                  <p>{cardData.lessionNumber} Lessons</p>
                </div>
              </div>
            </div>
    </div>
  )
}

export default CourseCard