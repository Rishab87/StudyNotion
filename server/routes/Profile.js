const express = require("express")
const router = express.Router()
const { auth, isStudent , isInstructor } = require("../middlewares/auth")
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instrcutorDashboard,
} = require("../controllers/Profile")

// Delete User Account
router.delete("/deleteProfile", auth,deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth , getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)

router.get('/getInstructorDetails' , auth ,isInstructor , instrcutorDashboard);

module.exports = router