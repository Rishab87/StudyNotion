import React, { useState } from 'react'
import frame from '../../../assets/Images/frame.png'
import signupImage from '../../../assets/Images/signup.webp'
import { Link, useNavigate } from 'react-router-dom'
import { IoEye  , IoEyeOff} from "react-icons/io5"
import countryCode from '../../../data/countrycode.json'
import { useDispatch } from 'react-redux'
import { setSignUpData } from '../../../slices/authSlice'
import { sendOtp } from '../../../services/operations/authAPI'

const Signup = () => {

  const [hidePass , setHidePass] = useState(true);
  const [hideConfirmPass , setHideConfirmPass] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData , setFormData] = useState({email: "" , password: "" , accountType: "Instructor" , confirmPassword: "" , phoneNumber: "" , firstName: "" , lastName: "" , countryCode: 0});

  function changeHandler(event){
      const {name ,   value} = event.target;
      setFormData((prevFormData)=>({
          ...prevFormData,
          [name]: value,
      }))
      console.log(formData);
  }

  function submitHandler(event){
      event.preventDefault();

      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords Do Not Match");
        return;
      }

      dispatch(setSignUpData(formData));
      dispatch(sendOtp(formData.email , navigate));
      
  }

  return (
    <div className='flex flex-row justify-center items-center w-full h-[92.3vh] mx-20'>
    <div className='w-11/12 flex flex-row h-[80%] flex-wrap'>
    <form onSubmit={submitHandler} className='flex flex-col gap-6 h-full w-[50%]'>
            <div className='flex flex-col gap-2'>
                <h1 className='text-[#F1F2FF] font-bold text-[1.5rem]'>Welcome Back</h1>
                <div>
                    <p className='text-richblack-100'>Discover Your Passions,</p>
                    <p className='text-blue-100 italic font-edu-sa'>Be Unstopppable</p>  
                </div>
            </div>     

            <div className='relative px-1 py-1 w-fit border-b-2 border-richblack-200 bg-richblack-800 text-richblack-200 rounded-full flex gap-8 font-semibold items-center justify-center'>
                <label htmlFor="instructor" className={`cursor-pointer ${formData.accountType === "Instructor"? "text-richblack-5 bg-richblack-900": "text-richblack-200 bg-richblack-800"} rounded-full py-2 px-4 duration-200 transition-all`}>Instructor</label>
                <input checked name='accountType' value="Instructor" type='radio' className='absolute invisible transition-all duration-200' id='instructor' onChange={changeHandler} required></input>

                <label htmlFor="student" className={`cursor-pointer ${formData.accountType === "Student"? "text-richblack-5 bg-richblack-900": "text-richblack-200 bg-richblack-800"} rounded-full py-2 px-4 duration-200 transition-all`}>Student</label>
                <input name='accountType' value="Student" type='radio' className='absolute invisible transition-all duration-200' id='student' onChange={changeHandler} required></input>
            </div>

            <div className='flex w-full gap-4'>
              <div className='flex flex-col w-[30%]'>
                  <label htmlFor="firstName" className='text-richblack-5 text-sm relative'>First Name<span className='absolute text-pink-400 top-0'>*</span></label>
                  <input name='firstName' type="text" id='firstName' placeholder='Enter first name' className='bg-richblack-800 placeholder:text-richblack-200 border-b-2 border-richblack-300 rounded-md py-2 w-full text-richblack-5 px-2' onChange={changeHandler}/>
              </div>

              
              <div className='flex flex-col w-[30%]'>
                  <label htmlFor="lastName" className='text-richblack-5 text-sm relative'>Last Name<span className='absolute text-pink-400 top-0'>*</span></label>
                  <input required name='lastName' type="text" id='lastName' placeholder='Enter last name' className='bg-richblack-800 placeholder:text-richblack-200 border-b-2 border-richblack-300 rounded-md py-2 w-full text-richblack-5 px-2' onChange={changeHandler}/>
              </div>
              
            </div>

            <div className='flex flex-col w-full'>
                <label htmlFor="email" className='text-richblack-5 text-sm relative'>Email Address<span className='absolute text-pink-400 top-0'>*</span></label>
                <input required name='email' type="email" id='email' placeholder='Enter email address' className='bg-richblack-800 placeholder:text-richblack-200 border-b-2 border-richblack-300 rounded-md py-2 w-[62.5%] text-richblack-5 px-2' onChange={changeHandler}/>
            </div>

            <div className='flex w-full gap-4'>
              <div className='flex flex-col w-full'>
                  <label htmlFor="phoneNumber" className='text-richblack-5 text-sm relative'>Phone Number<span className='absolute text-pink-400 top-0'>*</span></label>
                  <div className='flex w-full gap-2'>
                    <select name="countryCode" id="countryCode" className='bg-richblack-800 placeholder:text-richblack-200 border-b-2 border-richblack-300 rounded-md py-2 text-richblack-5 px-2 w-[9.6%]' onChange={changeHandler}>
                        {countryCode.map((element , index)=>(
                          <option value={element.code.split('+')[1]} key={index}>{element.code} {element.country}</option>
                        ))}
                    </select>
                    <input required name='phoneNumber' type='tel' id='phoneNumber' placeholder='Enter phone number' className='bg-richblack-800 placeholder:text-richblack-200 border-b-2 border-richblack-300 rounded-md py-2 text-richblack-5 px-2 w-[52%]' onChange={changeHandler}/>

                  </div>
              </div>
              
            </div>

            <div className='flex gap-4 w-full'>

              <div className='flex flex-col w-[30%]'>
                  <label htmlFor="pass" className='text-richblack-5 text-sm relative w-fit'>Password<span className='absolute text-pink-400 top-0'>*</span>
                  {
                      hidePass? <IoEyeOff className='cursor-pointer absolute lg:left-[190px] lg:top-[33px] z-[5] text-richblack-5' onClick={()=> setHidePass(false)}/> : <IoEye className='cursor-pointer absolute lg:left-[190px] lg:top-[33px] z-[5] text-richblack-5' onClick={()=> setHidePass(true)}/>
                  }
                  </label>
                  <input required name='password' type={`${hidePass? "password": "text"}`} id='pass' placeholder='Enter Password' className='bg-richblack-800 placeholder:text-richblack-200 border-b-2 border-richblack-300 rounded-md py-2 w-full text-richblack-5 px-2 z-[1]' onChange={changeHandler}/>
                  <p className={`text-pink-400 ${formData.password === formData.confirmPassword? "invisible": "visible"}`}>Passwords do not match</p>
              </div>

              <div className='flex flex-col w-[30%]'>
                  <label htmlFor="conPass" className='text-richblack-5 text-sm relative w-fit'>Confirm Password<span className='absolute text-pink-400 top-0'>*</span>
                  {
                    hideConfirmPass? <IoEyeOff className='cursor-pointer absolute lg:left-[190px] lg:top-[33px] z-[5] text-richblack-5' onClick={()=> setHideConfirmPass(false)}/> : <IoEye className='cursor-pointer absolute lg:left-[190px] lg:top-[33px] z-[5] text-richblack-5' onClick={()=> setHideConfirmPass(true)}/>
                  }
                  </label>
                  <input required name='confirmPassword' type={`${hideConfirmPass? "password": "text"}`} id='conPass' placeholder='Confirm Password' className='bg-richblack-800 placeholder:text-richblack-200 border-b-2 border-richblack-300 rounded-md py-2 w-full text-richblack-5 px-2 z-[1]' onChange={changeHandler}/>
              </div>

            </div>

            <button type='submit' className='bg-yellow-50 rounded-md py-2 w-[62.5%] hover:scale-90 duration-200 transition-all'>Create Account</button>
    </form>

        {/*Img */}
        <div className='relative w-[50%] translate-y-[20%] h-fit'>
            <img src={signupImage} className='w-[70%] z-20 relative'/>
            <img src={frame} className='absolute z-10 w-[70%] top-6 left-6'/> 
        </div>
    </div>
</div>
  )
}

export default Signup