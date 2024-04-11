import React from 'react'
import {useSelector , useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';
import {ACCOUNT_TYPE} from '../../../utils/constants';
import { addToCart } from '../../../slices/cartSlice';

const CourseDetailsCard = ({course , setConfirmationModal , handleBuyCourse}) => {

    const {token} = useSelector(state => state.auth);
    const {user} = useSelector(state => state.profile);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleAddToCart = ()=>{
        if(user && user?.accoutnType === ACCOUNT_TYPE.INSTRUCTOR){
            toast.error("Instructors can't buy courses");
            return;
        }
        if(token){
            dispatch(addToCart(course));
            return;
        }

        setConfirmationModal({
            text1: "You are not logged in",
            text2: "Please login to add course to cart",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: ()=> navigate('/login'),
            btn2Handler: ()=> setConfirmationModal(null),
        });
    }

    const handleShare = ()=>{
        copy(window.location.href);
        toast.success("Link copied to clipboard");
    }

    console.log(user);
    console.log(course.studentsEnrolled);
  return (
    <div>
        <img src={course.thumbnail} alt="thumbnail" className='max-h-[300px] min-h-[100px] w-[400px] rounded-xl' />

        <div>
            Rs. {course.price}
        </div>

        <div className='flex flex-col gap-y-6'>
            <button className='bg-yellow-50' 
            onClick={
                user && course?.studentsEnrolled.find((student) => student._id === user?._id)? ()=> navigate(`/dashboard/enrolled-courses`): handleBuyCourse
            }>
                {
                    
                    user && course?.studentsEnrolled.find((student) => student._id === user?._id)? "Go to Course": "Buy Now"
                }
            </button>

            { 
                //check even after buying course its still showing
                (user && !course?.studentsEnrolled.find((student) => student._id === user?._id)) && (
                    <button className='bg-yellow-50' onClick={handleAddToCart}>
                        Add to Cart
                    </button>
                )
            }
        </div>

        <div>
            <p>30-Day Money-Back Guarantee</p>
            <p>This Course Includes:</p>
            <div className='flex flex-col gap-y-3'>
                {
                    course?.instructions.map((item , index)=>{
                        <p key={index} className='flex gap-2'>
                            <span>{item}</span>
                        </p>
                    })
                }
            </div>
        </div>

        <div>
            <button onClick={handleShare} className='text-yellow-50'>
                Share
            </button>
        </div>
    </div>
  )
}

export default CourseDetailsCard