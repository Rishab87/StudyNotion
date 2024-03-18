const express = require('express');
const router = express.Router();

const {createCourse  , getCourseDetails , showAllCourses, editCourse} = require('../controllers/Course');
const {showAllCategories  , createCategory , categoryPageDetails} = require('../controllers/Categories');
const {createSection , updateSection , deleteSection} = require('../controllers/Section');
const {createRating , getAverageRating , getAllRating} = require('../controllers/ratingAndReview');
const {updateSubSection , createSubSection , deleteSubSection} = require('../controllers/subSection');

const {auth , isAdmin , isInstructor , isStudent} = require('../middlewares/auth');

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse)
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection)
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)
// Get all Registered Courses
router.get("/getAllCourses", showAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)

//create editCourse
router.put('/editCourse' ,auth , isInstructor ,  editCourse);


// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

module.exports = router;