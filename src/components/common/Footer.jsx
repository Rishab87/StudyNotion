import React from 'react'
import Logo from '../../assets/Logo/Logo-Full-Light.png'
import {FooterLink2} from '../../data/footer-links.js'

const Footer = () => {
  return (
    <div className='flex flex-col gap-4 p-10 justify-center items-center bg-richblack-800 border-t-2 border-richblack-600 mt-40'>
          <div className='flex gap-10 justify-between'>
          {/*Section 1 */}
          <div className='flex flex-row gap-10'>
              <div className='flex flex-col gap-3'>
                <img src={Logo} alt="logo" />
                <h3 className='font-bold text-richblack-100 text-sm '>Company</h3>
                <div className='text-richblack-400 flex flex-col gap-2 text-xs font-semibold justify-evenly pt-2'>
                  <p>About</p>
                  <p>Careers</p>
                  <p>Affiliates</p>
                </div>
                <div className='flex gap-2'>
                  <img src="" alt="" />
                  <img src="" alt="" />
                  <img src="" alt="" />
                  <img src="" alt="" />
                </div>
              </div>


              <div>
                <div>
                  <h3 className='font-bold text-richblack-100 text-sm'>Resources</h3>
                  <div className='text-richblack-400 flex flex-col gap-2 text-xs font-semibold justify-evenly pt-2'>
                    <p>Articles</p>
                    <p>Blog</p>
                    <p>Chart Sheet</p>
                    <p>Code Challenges</p>
                    <p>Docs</p>
                    <p>Projects</p>
                    <p>Videos</p>
                    <p>Workspaces</p>
                  </div>
                </div>
                <div>
                  <h3 className='font-bold text-richblack-100 text-sm'>Support</h3>
                  <p className='text-richblack-400 flex flex-col gap-2 text-xs font-semibold justify-evenly pt-2'>Help Center</p>
                </div>
              </div>
              <div>
                <div>
                  <h3 className='font-bold text-richblack-100 text-sm'>Plans</h3>
                  <div className='text-richblack-400 flex flex-col gap-2 text-xs font-semibold justify-evenly pt-2'>
                    <p>Paid memberships</p>
                    <p>For students</p>
                    <p>Buisness solutions</p> 
                  </div>
                
                </div>
                <div>
                  <h3 className='font-bold text-richblack-100 text-sm'>Community</h3>
                  <div className='text-richblack-400 flex flex-col gap-2 text-xs font-semibold justify-evenly pt-2'>
                    <p>Forums</p>
                    <p>Chapters</p>
                    <p>Events</p>
                  </div>
                </div>
              </div>
          </div>
          <div></div>{/*middle line  */}
          <div></div>
      </div>  

      <div></div>        
      <div></div>
    </div>
   
  )
}

export default Footer