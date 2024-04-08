//flow iss trah hi ki tags(ab categories hai yeh aur tags ab comma seperated string hai idhr category ka code hai) sirf admin bna skte hai , ki yeh yeh courses hone chahiye instructor choose kr skta hai tag kis category ka uska course hai 
const Category = require('../models/Categories');

function getRandomInt(max) {
  max = Math.floor(max);
  return Math.floor(Math.random() * (max));
}


exports.createCategory = async(req , res)=>{
    try{
        const {name, description} = req.body;

        if(!name || !description){
            return res.status(500).json({
                success: false,
                message: "All fields are required",
            });
        }

        //create entry in db
        const tagDetails = await Category.create({name , description});
        console.log(tagDetails);

        return res.status(200).json({
            success:true,
            message: "Tag created successfully",
        });
        
    } catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

//get all tags handler -- why we need this?
exports.showAllCategories = async(req , res)=>{
    try{
        const allCategories= await Category.find({} , {name: true , description: true}) //sare tags present jo hai woh ajayenge aur yeh make sure kr rhe hai tags main name aur description ho jo bhi tags aa rhe hai unmain , jan bujh ke true likha hai name , description ke sath taki aisa bhi kr skte hai yeh bta ske sir waise name aur description ke bina entry create hi nhi hogi woh uper hi handle kridya hai 
        return res.status(200).json({
            success: true,
            message: "All tags fetched successfully",
            allCategories,
        });

    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

//categoryPageDetails
//to display all courses in that category
//category ke andar courses ka array hai
exports.categoryPageDetails = async(req, res)=>{
    try {
        const { categoryId } = req.body;
        console.log("PRINTING CATEGORY ID: ", categoryId);
        // Get courses for the specified category
        const selectedCategory = await Category.findById(categoryId)
          .populate({
            path: "courses",
            match: { status: "Published" },
            populate: "ratingAndReview",
          })
          .exec()
    
        //console.log("SELECTED COURSE", selectedCategory)
        // Handle the case when the category is not found
        if (!selectedCategory) {
          console.log("Category not found.")
          return res
            .status(404)
            .json({ success: false, message: "Category not found" })
        }
        // Handle the case when there are no courses
        if (selectedCategory.courses.length === 0) {
          console.log("No courses found for the selected category.")
          return res.status(404).json({
            success: false,
            message: "No courses found for the selected category.",
          })
        }
    
        // Get courses for other categories
        const categoriesExceptSelected = await Category.find({
          _id: { $ne: categoryId },
        })
        console.log("CATEGORIES EXPECTED" , categoriesExceptSelected);
        let differentCategory = await Category.findOne(
          categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
            ._id
        )
          .populate({
            path: "courses",
            match: { status: "Published" },
          })
          .exec()
          console.log("Different COURSE", differentCategory)
        // Get top-selling courses across all categories
        const allCategories = await Category.find()
          .populate({
            path: "courses",
            match: { status: "Published" },
            populate: {
              path: "instructor",
          },
          })
          .exec()
        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 10)
         console.log("mostSellingCourses COURSE", mostSellingCourses)
        res.status(200).json({
          success: true,
          data: {
            selectedCategory,
            differentCategory,
            mostSellingCourses,
          },
        })
      } catch (error) {
        console.log(error.message);
        return res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
        })
      }
}