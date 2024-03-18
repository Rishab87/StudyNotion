import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactStars from "react-rating-stars-component"
import { RiDeleteBin6Line, RiStarSFill , RiStarSLine } from "react-icons/ri";
import { removeFromCart } from '../../../../slices/cartSlice';
import { getCourseAvgRating } from '../../../../services/operations/RatingsAPI';

const RenderCartCourses = () => {
    
    const {cart} = useSelector((state)=> state.cart);
    const dispatch = useDispatch();

    useEffect(()=>{
        let arr= [];

        cart.forEach((course)=>{
            arr.push(getCourseAvgRating(course._id));
        });
        
    } , [])

  return (
    <div>
        {
            cart.map((course , index)=>(
                <div>
                    <div>
                        <img src={course?.thumbnail} alt="" />
                        <div>
                            <p>{course.courseName}</p>
                            <p>{course?.category?.name}</p>
                            <div>
                                <span>arr[index]</span> {/*connect avgRating controller of backend here */}
                                <ReactStars
                                    count={5}
                                    size={20}
                                    edit={false}
                                    activeColor={"#ffd700"}
                                    emptyIcon={<RiStarSLine/>}
                                    fullIcon = {<RiStarSFill/>}
                                />

                                <span>{course?.ratingAndReviews?.length} Ratings</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button onClick={()=> dispatch(removeFromCart(course._id))}>
                            <RiDeleteBin6Line/>
                            <span>Remove</span>
                        </button>

                        <p>Rs {course.price}</p>
                    </div>
                </div>
            ))
        }
    </div>
  )
}

export default RenderCartCourses