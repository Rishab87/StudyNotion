import React, { useState } from 'react'
import frame from '../../../assets/Images/frame.png'
import loginImage from '../../../assets/Images/login.webp'
import { Link, useNavigate } from 'react-router-dom'
import { IoEye  , IoEyeOff} from "react-icons/io5"
import { useDispatch } from 'react-redux'
import { login } from '../../../services/operations/authAPI'

const Login = () => {
    const [hidePass , setHidePass] = useState(true);

    const [formData , setFormData] = useState({email: "" , password: "" , accountType: "Instructor"});

    function changeHandler(event){
        const {name ,   value} = event.target;
        setFormData((prevFormData)=>({
            ...prevFormData,
            [name]: value,
        }))
        console.log(formData);
    }

    const dispatch = useDispatch();
    const navigate = useNavigate();

    function submitHandler(event){
        event.preventDefault();
        dispatch(login(formData.email , formData.password , navigate));
         //dashboard app.js main add nhi kiya hai 
        //student ya instructor dash pe navigate uska logic dalo
    }
  return (
    <div className='flex flex-row justify-center items-center w-full h-[92.3vh] mx-20'>
        <div className='w-11/12 flex flex-row h-[80%] flex-wrap'>
        <form onSubmit={submitHandler} className='flex flex-col gap-8 h-full w-[50%]'>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-[#F1F2FF] font-bold text-[1.5rem]'>Welcome Back</h1>
                    <div>
                        <p className='text-richblack-100'>Discover Your Passions,</p>
                        <p className='text-blue-100 italic font-edu-sa'>Be Unstopppable</p>  
                    </div>
                </div>     

                <div className='relative px-1 py-1 w-fit border-b-2 border-richblack-200 bg-richblack-800 text-richblack-200 rounded-full flex gap-8 font-semibold items-center justify-center'>
                    <label htmlFor="instructor" className={`cursor-pointer ${formData.accountType === "Instructor"? "text-richblack-5 bg-richblack-900": "text-richblack-200 bg-richblack-800"} rounded-full py-2 px-4 duration-200 transition-all`}>Instructor</label>
                    <input name='accountType' value="Instructor" type='radio' className='absolute invisible transition-all duration-200' id='instructor' onChange={changeHandler}></input>

                    <label htmlFor="student" className={`cursor-pointer ${formData.accountType === "Student"? "text-richblack-5 bg-richblack-900": "text-richblack-200 bg-richblack-800"} rounded-full py-2 px-4 duration-200 transition-all`}>Student</label>
                    <input name='accountType' value="Student" type='radio' className='absolute invisible transition-all duration-200' id='student' onChange={changeHandler}></input>
                </div>
                
                <div className='flex flex-col w-full'>
                    <label htmlFor="email" className='text-richblack-5 text-sm'>Email Address</label>
                    <input required name='email' type="email" id='email' placeholder='Enter email address' className='bg-richblack-800 placeholder:text-richblack-200 border-b-2 border-richblack-300 rounded-md py-2 w-[60%] text-richblack-5 px-2' onChange={changeHandler}/>
                </div>

                <div className='flex flex-col w-full'>
                    <label htmlFor="pass" className='text-richblack-5 text-sm relative w-fit'>Password
                    {
                        hidePass? <IoEyeOff className='cursor-pointer absolute lg:left-[400px] lg:top-[33px] z-[5] text-richblack-5' onClick={()=> setHidePass(false)}/> : <IoEye className='cursor-pointer absolute lg:left-[400px] lg:top-[33px] z-[5] text-richblack-5' onClick={()=> setHidePass(true)}/>
                    }
                    </label>
                    <input required name='password' type={`${hidePass? "password": "text"}`} id='pass' placeholder='Enter Password' className='bg-richblack-800 placeholder:text-richblack-200 border-b-2 border-richblack-300 rounded-md py-2 w-[60%] text-richblack-5 px-2 z-[1]' onChange={changeHandler}/>
                    <Link to="/forgot-password" className='items-end w-fit'>
                        <p className='text-blue-100 text-xs cursor-pointer hover:underline'>Forgot password</p>
                    </Link>
                </div>

                <button type='submit' className='bg-yellow-50 rounded-md py-2 w-[60%] hover:scale-90 duration-200 transition-all'>Sign in</button>
        </form>

            {/*Img */}
            <div className='relative w-[50%] translate-y-[20%] h-fit'>
                <img src={loginImage} className='w-[70%] z-20 relative'/>
                <img src={frame} className='absolute z-10 w-[70%] top-6 left-6'/> 
            </div>
        </div>
    </div>
  )
}

export default Login