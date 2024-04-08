import React from 'react'
import {useSelector , useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { buyCourse } from '../../../../services/operations/studentFeaturesAPI';
import {useParams} from 'react-router-dom';

//move file to pages folder
const BuyCourse = () => {

    const {token} = useSelector(state => state.auth);
    const {user} = useSelector(state => state.profile);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const courseId = useParams().id;

    const handleBuyCourse = ()=>{
      if(token){
        buyCourse(token , [courseId] , user , navigate , dispatch);
      }
      else{
        navigate('/login');
      }
    }

  return (
    <div className='h-[92.3vh]'>
        {/*course desc */}
        <div>
            {/*course hero */}
            <div>
                <div>
                    Home / Learning / <span>{}</span>
                </div>
            </div>

            {/*courseContent */}
            <div></div>
        </div>

        {/*payments */}
        <div>
          <button className='bg-yellow-50 px-6 py-4' onClick={()=> handleBuyCourse()}>
             Buy Now
          </button>
        </div>
    </div>
  )
}

export default BuyCourse