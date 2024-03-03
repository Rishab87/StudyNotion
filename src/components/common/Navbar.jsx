import React, { useEffect, useState } from 'react'
import { Link, matchPath } from 'react-router-dom'
import logo from '../../assets/Logo/Logo-Full-Light.png'
import {NavbarLinks} from '../../data/navbar-links'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaShoppingCart } from 'react-icons/fa'
import ProfileDropDown from '../core/Auth/ProfileDropDown'
import { apiConnector } from '../../services/apiconnector'
import { categories } from '../../services/apis'
import { MdKeyboardArrowDown } from "react-icons/md";


const Navbar = () => {
//HW: profile drop down menu , add dashboard , add logout and reach login page , create custom hook jo profile menu ki alawa kahi aur click krenge toh uss menu ko band krdega
//hw: ref hook pdo
    const {token} = useSelector(state => state.auth);
    const {user} = useSelector(state => state.profile);
    const {totalItems} = useSelector(state => state.cart);

    const [subLinks , setSubLinks] = useState([]);

    const fetchSubLinks = async()=>{
        try{
            const result = await apiConnector("GET" , categories.CATEGORIES_API)
            console.log(result);
            setSubLinks(result.data.allCategories)
        } catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchSubLinks();
    } , []);

    const location = useLocation();
    const matchRoute = (route)=>{
        return matchPath({path:route} , location.pathname);
    }

  return (
    <div className='flex h-14 items-center border-b-[1px] border-b-richblack-700 justify-center bg-richblack-800'>
        <div className='flex w-11/12 max-w-maxContent items-center justify-between mx-auto'>
            <Link to="/">
                <img src={logo} width={160} height={42} loading='lazy'/> 
            </Link>

            <nav className=''>
                <ul className='flex gap-x-6 text-richblack-25'>
                    {
                        NavbarLinks.map((link  , index)=>{
                            return(
                                <li key={index}>
                                {
                                    link.title === 'Catalog'?(
                                        <div className='flex items-center gap-2 group relative'>
                                            <p>{link.title}</p>
                                            <MdKeyboardArrowDown/>
                                            <div className='invisible absolute left-[50%] top-[50%] flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px] translate-x-[-50%] z-2 translate-y-[40%]'>
                                                <div className='absolute left-[50%] top-0 w-6 rotate-45 bg-richblack-5 rounded h-6 translate-y-[-45%] translate-x-[80%] z-[5]'></div>

                                                {//hw: add css
                                                    subLinks.length?(
                                                            subLinks.map((subLink , index)=>(
                                                                <Link to = {`${subLink.name}`} key={index}>
                                                                    <p>{subLink.name}</p> 
                                                                </Link>
                                                            ))
                                                        ):(<div></div>)
                                                }
                                            </div>
                                        </div>
                                    ):(
                                        <Link to={link?.path}>
                                            <p className={`${matchRoute(link?.path)? "text-yellow-25" : "text-richblack-25"}`}>
                                                {link.title}
                                            </p>
                                        </Link>
                                    )
                                }
                                </li>
                            )
                        })
                    }
                </ul>  
            </nav>

            {/*LOgin/singup/dashboard */}
            <div className='flex gap-4 items-center'>
                    {
                        user && user?.accountType !== "Instructor" && (
                            <Link to = '/dashboard/cart' className='relative'>
                                <FaShoppingCart color='white'/>
                                { //hw: cart no. item styling 
                                    totalItems> 0 && (
                                        <span>
                                            {totalItems}
                                        </span>
                                    )
                                }
                               
                            </Link>                            
                        )
                    }
                    {
                        token === null && (
                            <Link to='/login'>
                                <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[5px] text-richblack-100 rounded-md hover:scale-90 transition-all duration-200'>
                                    Log in
                                </button>
                            </Link>
                        )
                    }
                    {
                        token === null && (
                            <Link to= '/signup'>
                                <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[5px] text-richblack-100 rounded-md hover:scale-90 transition-all duration-200'>
                                    Sign Up
                                </button>
                            </Link>
                        )
                    }
                    {
                        token !== null && <ProfileDropDown/>
                    }
            </div>
        </div>
    </div>
  )
}

export default Navbar