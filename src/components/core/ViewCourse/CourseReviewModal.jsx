import React from 'react'
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux'
import ReactStars from 'react-rating-stars-component'
import IconBtn from '../../common/IconBtn';
import { createRating } from '../../../services/operations/RatingsAPI';
import { IoIosCloseCircle } from "react-icons/io";


const CourseReviewModal = ({setReviewModal}) => {

    const {user} = useSelector(state=> state.profile);
    const {token} = useSelector(state=> state.auth);

    const {courseEntireData} = useSelector(state=> state.course);

    const { register, setValue ,  handleSubmit, formState: { errors } } = useForm();

    useEffect(()=>
    {
        setValue("courseExperience"  , "");
        setValue("courseRating" , 0);
        
    } , []);


    

    const onSubmit = async(data) => {
        await createRating({
            courseId: courseEntireData._id,
            rating: data?.courseRating,
            review: data?.courseExperience , 
        } , token);
    }

    const RatingChanged = (newRating) => {
        setValue("courseRating" , newRating);
    }

  return (

    <div className='text-white absolute h-[100vh] w-[100vw] z-10 flex items-center justify-center'>
        <div className='absolute -z-10 bg-black opacity-50 backdrop-blur-sm inset-0 h-[100vh] w-[100vw]'></div>
        <div className='flex flex-col justify-center items-center w-[25%] min-w-[300px]'>
            <div className='flex justify-end w-full'>
                <button onClick={()=> setReviewModal(false)} className='bg-white text-black font-bold rounded-md'>
                    <IoIosCloseCircle fontSize={"1.5rem"}/>
                </button>
            </div>

            <div className='flex flex-col justify-center items-center w-[30%] min-w-[350px]'>
                <div className='flex flex-col justify-center items-center gap-4'>
                    <img src={user.image} alt='user-image' className=' aspect-square w-[50px] rounded-full object-cover'/>
                    <div className='flex flex-col justify-center items-center gap-2'>
                        <p>{user.firstName} {user.lastName}</p>
                        <p>Posting Publically</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className='flex mt-6 items-center flex-col justify-center w-full gap-3'>
                    <div className='flex flex-col justify-center items-center w-full gap-4'>
                        <ReactStars 
                        count={5}
                        onChange={RatingChanged}
                        size={24}
                        activeColor={"#ffd700"}
                        />

                        <label htmlFor="courseExp">Add Your Experience</label>
                        <textarea name="" id="courseExp" placeholder='Add your experience here' {...register("courseExperience" , {required: true})} className='form-style min-h-[130px] w-full text-black'></textarea>
                        {
                            errors.courseExperience && <span>This field is required <span>*</span></span>
                        }
                    </div>

                    <div className='flex justify-between w-full'>
                        <button onClick={()=> setReviewModal(false)} className=' bg-pink-400 rounded-md py-3 px-6'>
                            Cancel
                        </button>

                        <IconBtn
                            text='Save'
                            type={"submit"}
                        />
                    </div>

                </form>
            </div>
        </div>
    </div>
  )
}

export default CourseReviewModal