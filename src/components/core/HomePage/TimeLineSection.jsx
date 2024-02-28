import React from 'react'
import Logo1 from '../../../assets/TimeLineLogo/Logo1.svg'
import Logo2 from '../../../assets/TimeLineLogo/Logo2.svg'
import Logo3 from '../../../assets/TimeLineLogo/Logo3.svg'
import Logo4 from '../../../assets/TimeLineLogo/Logo4.svg'
import timeLineImage from '../../../assets/Images/TimelineImage.png'

const timeline = [
    {
        Logo: Logo1,
        Heading: "Leadership",
        Description: "Fully committed to the success comapny",
    },
    {
        Logo: Logo2,
        Heading: "Responsibility",
        Description: "Students will always be our top priority",
    },
    {
        Logo: Logo3,
        Heading: "Flexibility",
        Description: "The ability to switch is an important skills",
    },
    {
        Logo: Logo4,
        Heading: "Solve the problem",
        Description: "Code your way to a solution",
    }
];

const TimeLineSection = () => {
  return (
    <div>
        <div className='flex gap-20 items-center py-14'>
            <div className='w-[45%] flex flex-col gap-5'>
                {
                    timeline.map((element , index)=>{
                        return(
                            <div className='flex flex-row gap-6' key={index}>
                            <div className='w-[50px] h-[50px] bg-white flex items-center shadow-[rgba(0,_0,_0,_0.25)_0px_25px_50px_-12px] justify-center rounded-full'>
                                <img src={element.Logo}/>
                            </div>

                            <div>
                                <h2 className='font-semibold text-[18px]'>{element.Heading}</h2>
                                <p className='text-base'>{element.Description}</p>
                            </div>
                        </div>
                        )
                        //DONE: add shadow in logos
                    })
                    //HW: add dots below each logo
                }
            </div>

            {/*add moving blue blob behind image*/}
            <div className='relative shadow-blue-200 '>
                <img src={timeLineImage} alt='timeLineImage' className='shadow-white object-cover h-fit'/>

                <div className='absolute bg-caribbeangreen-700 flex flex-row text-white uppercase py-7 left-[50%] -translate-x-[50%] -translate-y-[50%]'>
                    <div className='flex flex-row gap-5 items-center border-r border-caribbeangreen-300 px-7'>
                        <p className='text-3xl font-bold'>10</p>
                        <p className=' text-caribbeangreen-300 text-sm'>Years of Exprience</p>
                    </div>

                    <div className='flex gap-5 items-center px-7'>
                    <p className='text-3xl font-bold'>250</p>
                        <p className=' text-caribbeangreen-300 text-sm'>Type of Courses</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default TimeLineSection