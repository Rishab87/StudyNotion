import React from 'react'
import instructorImage from '../../../assets/Images/Instructor.png'
import HighlighText from './HighlighText'
import CTAButton from './Button'
import { FaArrowRight } from 'react-icons/fa'

const InstructorSection = () => {
  return (
    <div>
        <div className='flex gap-20 items-center mt-16'>
            <div className='w-[50%]'>
                <img src={instructorImage} alt="instructorImage"  className='shadow-white'/>
            </div>

            <div className='w-[50%] flex flex-col gap-10'>
                <div className='text-4xl font-semibold w-[50%]'>
                    Become an 
                    <HighlighText text={"Instructor"}/>
                </div>

                <p className='font-medium text-[16px] w-[80%] text-richblack-300'>
                    Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
                </p>
                
                <div className='w-fit'>

                    <CTAButton active={true} linkto={'/signup'}>
                        <div className='flex gap-2 items-center'>
                            Start Teaching Today
                            <FaArrowRight/>
                        </div>
                    </CTAButton>

                </div>

            </div>
        </div>
    </div>
  )
}

export default InstructorSection