import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import RatingStars from '../../common/RatingStars'
import avgReviewCount from '../../../utils/avgRating'

const Course_Card = ({course , Height}) => {

    const [avgReview , setAvgReview] = React.useState(0)

    useEffect(()=>{
        const count = avgReviewCount(course.ratingAndReview); //pr avg rating ke liye shyd backend main bhi ek controller bnaya tha we can use that as well instead of this
        setAvgReview(count);

    } , [course])

    const {catalogName} = useParams();

  return (
    <div>
    <Link to={`/catalog/${catalogName}/courses/${course._id}`}>
      <div>
        <div className="rounded-lg">
          <img
            src={course?.thumbnail}
            alt="course thumnail"
            className={`${Height} w-full rounded-xl object-cover `}
          />
        </div>
        <div className="flex flex-col gap-2 px-1 py-3">
          <p className="text-xl text-richblack-5">{course?.courseName}</p>
          <p className="text-sm text-richblack-50">
            {course?.instructor?.firstName} {course?.instructor?.lastName}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-yellow-5">{avgReview || 0}</span>
            {/* <ReactStars
              count={5}
              value={avgReviewCount || 0}
              size={20}
              edit={false}
              activeColor="#ffd700"
              emptyIcon={<FaRegStar />}
              fullIcon={<FaStar />}
            /> */}
            <RatingStars Review_Count={avgReview} />
            <span className="text-richblack-400">
              {course?.ratingAndReviews?.length} Ratings
            </span>
          </div>
          <p className="text-xl text-richblack-5">Rs. {course?.price}</p>
        </div>
      </div>
    </Link>
  </div>
  )
}

export default Course_Card