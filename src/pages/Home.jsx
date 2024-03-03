import React from 'react'
import {FaArrowRight} from "react-icons/fa";
import HighlighText from '../components/core/HomePage/HighlighText';
import { Link } from 'react-router-dom';
import CTAButton from '../components/core/HomePage/Button';
import Banner from '../assets/Images/banner.mp4'
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import Footer from '../components/common/Footer';
import TimeLineSection from '../components/core/HomePage/TimeLineSection';
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection';
import InstructorSection from '../components/core/HomePage/InstructorSection';
import ExploreMore from '../components/core/HomePage/ExploreMore';
import './Home.css'

const Home = () => {
  return (
    <div className='z-[0]'>
        {/*Section 1 */}
        <div className='relative mx-auto flex flex-col w-9/12 items-center text-white justify-between max-w-maxContent min-h-screen'>

            <Link to={'/signup'}>{/*add shadowes */}
                <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit border-b-2 border-richblack-200'>

                    <div className='flex items-center gap-2 rounded-full px-10 py-[5px] group-hover:ring-richblack-900'>
                        <p>Become an instructor</p>
                        <FaArrowRight/>
                    </div>

                </div>
            </Link>

            <div className='text-center text-4xl font-semibold mt-7'>
                Empower Your Future With 
                <HighlighText text={"Coding Skills"} /> {/*span tag se bhi kr skte hai */}
            </div>

            <div className='mt-4 w-[90%] text-center text-lg font-bold text-richblack-300'>
                With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
            </div>

            <div className='flex gap-7 mt-8'>
                <CTAButton active={true} linkto={"signup"}>
                    Learn More
                </CTAButton>
                {/*match border shadows etc with figma file */}
                <CTAButton active={false} linkto={"login"}>
                    Book a Demo
                </CTAButton>
                
            </div>

            <div className='custom-shadow mx-3 my-12 w-[90%]'>
                 <video muted loop autoPlay>
                    <source src={Banner} type='video/mp4'></source>
                </video>
            </div>

        </div>

        {/*Code section1  */}
        <div className='flex items-center justify-center w-full'>
            <CodeBlocks
                position={"lg:flex-row"}
                heading={
                    <div className='text-4xl font-bold'>
                        Unlock Your
                        <HighlighText text={"coding potential"}/>
                        with our online courses
                    </div>
                }
                subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}
                ctabtn1={{
                    btnText: "Try it yourself",
                    linkto: '/signup',
                    active: true,
                }}

                ctabtn2={{
                    btnText: "Learn More",
                    linkto: "/login",
                    active: false
                }}

                codeblock={'<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n<linkrel="stylesheet"href="styles.css">\n</head>\n<body>\n<h1><ahref="/">Header</a></h1>\n<nav><a href="one/">One</a><ahref="two/">Two</a>\n<a href="three/">Three</a>\n</nav>'}
                backgroundGradient={'bg-gradient-to-br from-[#8A2BE2] from-100% via-[#FFA500] via-100% to-[#F8F8FF] to-100%'}
            />
        </div>

        {/*Code section2  */}
        <div className='flex items-center justify-center'>
            <CodeBlocks
                position={"lg:flex-row-reverse"}
                heading={
                    <div className='text-4xl font-bold'>
                        Start
                        <HighlighText text={"coding in seconds"}/>
                    </div>
                }
                subheading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}
                ctabtn1={{
                    btnText: "Continue Lesson", 
                    linkto: '/signup', //check where to redirect
                    active: true,
                }}

                ctabtn2={{
                    btnText: "Learn More",
                    linkto: "/login", //check where to redirect
                    active: false
                }}

                codeblock={'<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n<linkrel="stylesheet"href="styles.css">\n</head>\n<body>\n<h1><ahref="/">Header</a></h1>\n<nav><a href="one/">One</a><ahref="two/">Two</a>\n<a href="three/">Three</a>\n</nav>'}
                codeColor={'text-yellow-25'}
                backgroundGradient={'bg-gradient-to-br from-[#1FA2FF] from-100% via-[#12D8FA] via-100% to-[#A6FFCB] to-100%'}
            />
        </div>

        <ExploreMore/>
            
        {/*Section 2 */}
        <div className='bg-pure-greys-5 text-richblack-700'>
            <div className='homepage-bg h-[333px]'>
                <div className='w-11/12 max-w-maxContent flex items-center justify-between gap-5 mx-auto flex-col'>
                    <div className='h-[150px]'></div>
                    <div className='flex flex-row gap-7 text-white'>
                        <CTAButton active={true} linkto={'/signup'}>
                            <div className='flex items-center gap-3'>
                                Explore Full Catalog
                                <FaArrowRight/>
                            </div>
                        </CTAButton>
                        <CTAButton active={false} linkto={'/signup'}>
                            Learn more
                        </CTAButton>
                    </div>
                </div>
            </div>

            <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>
                <div className='flex gap-5 mb-10 mt-[95px] justify-center'>
                    <div className='text-4xl font-semibold w-[45%]'>
                        Get the Skills you need for a 
                        <HighlighText text={"Job that is in demand"}/>
                    </div>

                    <div className='flex flex-col gap-10 w-[45%] items-start'>
                        <div className='text-[16px]'>
                            The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                        </div>

                        <CTAButton active={true} linkto={'#'}>Learn More</CTAButton>

                    </div>
                </div>

                <TimeLineSection/>
                <LearningLanguageSection/>
            </div>


        </div>


        {/*Section 3 */}
        <div className='w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white'>
                <InstructorSection/>

                <h2 className='text-center text-4xl font-semibold mt-10'>Review From Other Learners</h2>
                {/*Review Slider */}
        </div>

        {/*Section 4 */}

        <Footer></Footer>
    </div>
  )
}

export default Home