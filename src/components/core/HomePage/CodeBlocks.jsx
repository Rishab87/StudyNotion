import React from 'react'
import CTAButton from './Button';
import { FaArrowRight } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';

const CodeBlocks = ({position , heading , subheading  , ctabtn1 , ctabtn2 , codeblock , backgroundGradient}) => {
   // const colors = ['text-yellow-25', 'text-white', 'text-blue-500' , 'text-pink-100' , 'text-pink-300']; 

  return (
    <div className={`flex ${position} my-20 justify-between gap-10 items-center w-9/12 flex-col lg:flex-row flex-wrap text-center lg:text-left`}>

        {/*Section 1 */}
        <div className='lg:w-[50%] flex flex-col gap-8 text-white min-w-[300px] w-[80%]'>
            {heading}
            <div className='text-richblack-300 font-bold'>
                {subheading}
            </div>

            <div className='flex gap-7 mt-7 flex-col lg:flex-row md:flex-row mx-auto lg:mx-0'>
                <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                    <div className='flex gap-2 items-center'>
                        {ctabtn1.btnText}
                        <FaArrowRight/>
                    </div>
                </CTAButton>

                <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
                    {ctabtn2.btnText}
                </CTAButton>
            </div>
            
        </div>
        {/*Section 2 */}
        <div className='flex flex-row min-w-[350px] w-[45%] py-4 border-t-2 border-l-2 border-white border-opacity-20 bg-gradient-to-r from-[#0E1A2D] from-24% to-[#111E32] to-38% relative text-[0.9rem] backdrop-blur-md text-left'>
            {/* Done --> HW: add yellow gradient */}
            <div className={`absolute h-[80%] w-[70%] ${backgroundGradient} rounded-full blur-2xl -z-1 opacity-20 -top-8 -left-8`}></div>
            <div className='text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold'>
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>10</p>
                <p>11</p>
            </div>
            <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono text-white pr-2`}>
                <TypeAnimation
                sequence={[codeblock , 500 , ""]}
                repeat={Infinity}
                cursor={true}
                style={{ //find meaning of this codeblock
                /*HW: Footer */
                    whiteSpace:'pre-line',
                    display: 'block'
                }}
                omitDeletionAnimation= {true}
                />
            </div>
        </div>
    </div>
  )
}

export default CodeBlocks