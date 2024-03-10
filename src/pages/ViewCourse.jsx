import React, { useState } from 'react'
import { Outlet } from 'react-router-dom';


const ViewCourse = () => {

  const [reviewModal , setReviewModal] = useState(false);


  return (
    <div>
          <ViewDetailsSidebar setReviewModal={setReviewModal}/>
          <div>
            <Outlet/>
          </div>
          {reviewModal && <CourseReviewModal setReviewModal={setReviewModal}/>}
    </div>
  )
}

export default ViewCourse