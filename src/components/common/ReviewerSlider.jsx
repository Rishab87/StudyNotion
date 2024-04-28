import React, { useEffect, useState } from 'react'
import { getRatings } from '../../services/operations/RatingsAPI'
import { Autoplay , Navigation , Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import ReactStars from "react-rating-stars-component";

const ReviewerSlider = () => {

    const [ratings , setRatings] = useState([]);

    useEffect(()=>{
        const fetchRatings = async()=>{
            const response = await getRatings();
            setRatings(response);
            // console.log(response);
        }

        fetchRatings();
    
    })
  return (
    <div className='p-4 '>
        <Swiper
        modules={[Autoplay , Navigation , Pagination]} 
        effect="fade"   
        spaceBetween={50}
        slidesPerView={3}
        loop={true}
        onMouseEnter={(swiper) => swiper.autoplay.stop()}
        onMouseLeave={(swiper) => swiper.autoplay.start()}
        autoplay={{delay: 1000 ,  disableOnInteraction: false}}
        navigation={true} 
        pagination={{ clickable: true }}
        className='flex items-center justify-center p-4'
        >
        {ratings.map((rating , index)=>(
            <SwiperSlide key={index} className=' bg-richblack-800 min-w-[300px] p-4 rounded-md w-[40%] min-h-[200px]'>
                <div className='flex flex-col gap-2'>
                    <div className='flex gap-7'>
                        <img src={rating.user.image} alt="" width={"50px"} className='rounded-full' />
                        <div>
                        <p className='text-richblack-5'>{rating.user.firstName} {rating.user.lastName}</p>
                        <p className=' text-richblack-300'>{rating.user.email}</p>
                        </div>

                    </div>
                    <div className='ml-2'>
                        <p className=' text-richblack-25'>{rating.review}</p>
                    </div>
                    <div className='flex gap-7 items-center'>
                        <p className='ml-2 font-bold text-[#ffd700]'>{rating.rating}</p>
                        <ReactStars
                            count={5}
                            value={rating.rating}
                            size={24}
                            activeColor="#ffd700"
                        />
                   </div>

                </div>

            </SwiperSlide>
        ))}

        </Swiper>
    </div>
  )
}

export default ReviewerSlider