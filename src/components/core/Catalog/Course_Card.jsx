import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import RatingStars from '../../common/RatingStars'
import avgReviewCount from '../../../utils/avgRating'

const Course_Card = ({course , Height}) => {

    const [avgReview , setAvgReview] = React.useState(0)

    useEffect(()=>{
        const count = avgReviewCount(course.ratingAndReview); //pr avg rating ke liye shyd backend main bhi ek controller bnaya tha we can use that as well instead of this
        setAvgReview(count);

    } , [course])

  return (
    <div>
        <Link to= {`courses/${course._id}`}>
            <div>
                <div>
                    <img src={course.thumbnail} alt="course-thumbnail"  className={`${Height} w-full rounded-xl object-cover`}/>
                </div>
                <div>
                    <p>{course.courseName}</p>
                    <p>{course.instructor.firstName} {course.instructor.lastName}</p>
                    <div>
                        <span>{avgReviewCount || 0}</span>
                        <RatingStars Review_Count = {avgReview}/> //check this component 
                        <span>{course.ratingAndReview.length} Ratings</span>
                    </div>
                    <p>{course.price}</p>
                </div>
            </div>
        </Link>
    </div>
  )
}

export default Course_Card