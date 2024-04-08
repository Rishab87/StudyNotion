import React from 'react'
import {SwiperSlide , Swiper} from 'swiper/react'
import 'swiper/css'
import "swiper/css/pagination"
import "swiper/css/free-mode"
import {Autoplay , FreeMode , Pagination , Navigation} from "swiper/modules"
import Course_Card from './Course_Card'

const CourseSlider = ({Courses}) => {
  return (
    <div>
        {
            Courses.length? (
                <Swiper slidesPerView={1} loop={true} spaceBetween={200} modules={[Pagination ,Autoplay , Navigation]} pagination={true} autoplay={{
                    delay:2500,
                    disableOnInteraction:true
                }} navigation={true} breakpoints={{1024: {slidesPerView:3}}}>
                    {
                        Courses.map((course , index)=>(
                            <SwiperSlide key={index}>
                                <Course_Card course={course} Height ={'h-[250px]'}/>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            ): (
                <p>No Course Found</p>
            )
        }
    </div>
  )
}

export default CourseSlider