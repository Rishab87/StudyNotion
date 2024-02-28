//flow iss trah hi ki tags(ab categories hai yeh aur tags ab comma seperated string hai idhr category ka code hai) sirf admin bna skte hai , ki yeh yeh courses hone chahiye instructor choose kr skta hai tag kis category ka uska course hai 
const Category = require('../models/Categories');

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
    try{
        const {categoryId} = req.body;

        const selectedCategory = await Category.findById(categoryId).populate("courses").exec();

        if(!selectedCategory){
            return res.status(404).json({
                success: false,
                message: "Data not found",
            });
        }
               
        const differentCategories = await Category.find({_id: {$ne: categoryId}}).populate('courses').exec(); //aisi categories ka data ajayega jo iss category id ke equal nhi hai

        //HW: top 10 selling courses --> agar koi course jitne baar bik chuka hai uske basis pr courses ko sort krke show kre woh krna hai,  jismain sbsezyada studentsEnrolled honge uske basis pe sort?

        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategories,
                //topselling courses bhi dalo after fetching
            },
        });

    } catch(error){
        return res.status(500).json({
            success: true , 
            message: "Something went wrong while fetching courses in that category",
            error: error.message,
        });
    }
}

//HW: Contact Us wala form bnao normal html se usse data ko lo bache ko email data submit hogya aur apne ap ko mail kro uss data ke sath
//HW: DONE: Create routes and index.js