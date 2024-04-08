import React, { useEffect  , useState} from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCalalogPageData } from '../services/operations/pageAndComponentData';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import Course_Card from '../components/core/Catalog/Course_Card';


const Catalog = () => {

    const {catalogName} = useParams();
    const [catalogPageData , setCatalogPageData] = useState(null);
    const [categoryId , setCategoryId] = useState(null);

    //fetch
    useEffect(()=>{
        const getCategoryDetails = async()=>{
            const res = await apiConnector("GET" , categories.CATEGORIES_API);
            const category_id = res.data.allCategories.filter((ct)=> ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
            setCategoryId(category_id);

        }
        getCategoryDetails();
    } , [catalogName]);

    useEffect(()=>{
        const getCategories = async()=>{
            try{
                const res = await getCalalogPageData(categoryId);
                setCatalogPageData(res);
            }catch(error){
                console.log(error);
            }
        }
        if(categoryId){
            console.log(categoryId);
            getCategories();
        }
    } , [categoryId]);

    if(!catalogPageData){
        return <p className=' h-[92.3vh] w-screen flex items-center justify-center text-2xl font-bold text-white'>No Courses Found</p>
    }

  return (
    <div>

        <div>
            <p>{`Home / Catalog /`}
                <span>
                    {catalogPageData.data.selectedCategory.name}
                </span>
            </p>
            <p>{catalogPageData.data.selectedCategory.name}</p>
            <p>{catalogPageData.data.selectedCategory.description}</p>
        </div>
        
        <div>
            <div>
                <div>Courses to get you started</div>
                <div className='flex gap-x-3'>
                    <p>Most Popular</p>
                    <p>New</p>
                </div>
                <div>
                    <CourseSlider Courses = {catalogPageData.data.selectedCategory.courses}/>
                </div>
            </div>

            <div>
                <p>Top Courses in {catalogPageData.data.selectedCategory.name}</p>
                <div>
                    <CourseSlider Courses=  {catalogPageData.data.differentCategory.courses}/>
                </div>
            </div>

            <div>
                <div>Frequently Bought</div>
                <div className='py-8'>
                    <div className='grid grid-cols-1 lg:grid-cols-2'>
                        {
                            catalogPageData.data.mostSellingCourses?.slice(0,4).map((course , index)=>( 
                                <Course_Card course={course} key={index} Height ={'h-[400px]'}/>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>

        <Footer/>
    </div>
  )
}

export default Catalog