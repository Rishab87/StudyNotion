import React from 'react'
import HighlighText from './HighlighText'
import knowYourProgress from '../../../assets/Images/Know_your_progress.svg'
import compareWithOthers from '../../../assets/Images/Compare_with_others.svg'
import planYourLesson from '../../../assets/Images/Plan_your_lessons.svg'
import CTAButton from './Button'

const LearningLanguageSection = () => {
  return (
    <div>
        <div className='flex flex-col gap-5 mt-[100px] items-center pb-20'>
            <div className='text-4xl font-semibold text-center'>
                Your Swiss Knife for
                <HighlighText text={"learning any language"}/>

                <div className='text-center text-richblack-600 mx-auto mt-3 text-base font-medium w-[70%]'>
                    Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
                </div>
                {/*Hit and trial with margin to align imgs acc to design files */}
                <div className='flex items-center justify-center mt-5 flex-col lg:flex-row'>
                    <img src={knowYourProgress} alt='knowYourProgress' className='object-contain -mr-24'/>
                    <img src={compareWithOthers} alt='compareWithOthers' className='object-contain'/>
                    <img src={planYourLesson} alt='planYourLesson' className='object-contain -ml-36'/>

                </div>

            </div>

            <div className='w-fit'>
                    <CTAButton active={true} linkto={'#'}>
                        Learn More
                    </CTAButton>
            </div>
        </div>
    </div>
  )
}

export default LearningLanguageSection