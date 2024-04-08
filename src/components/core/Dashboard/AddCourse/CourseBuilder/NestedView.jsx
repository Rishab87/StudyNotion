import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RxDropdownMenu } from "react-icons/rx";
import { MdEdit , MdDelete } from 'react-icons/md';
import { BiSolidDownArrow } from 'react-icons/bi';
import { FaPlus } from "react-icons/fa";
import SubSectionModal from './SubSectionModal';
import ComfirmationModal from '../../../../common/ConfirmationModal'
import { setCourse } from '../../../../../slices/courseSlice';
import { deleteSection , deleteSubSection } from '../../../../../services/operations/courseDetailsAPI';

const NestedView = ({handleChangeEditSectionName}) => {

    const {course} = useSelector(state=> state.addCourse);
    const {token} = useSelector(state=> state.auth);
    const dispatch = useDispatch();

    const [addSubSection , setAddSubSection] = useState(null);
    const [viewSubSection , setViewSubSection] = useState(null);
    const [editSubSection , setEditSubSection] = useState(null);

    const [confirmationModal , setConfirmationModal] = useState(null);

    const handleDeleteSection = async(sectionId)=>{
        const result = await deleteSection({
            sectionId,
            courseId: course._id,
        } , token);

        if(result){
            dispatch(setCourse(result));
        }

        setConfirmationModal(null);
    }

    const handleDeleteSubSection = async(subSectionId , sectionId)=>{
        const result = await deleteSubSection({subSectionId , sectionId , courseId:course._id} , token);
        console.log(subSectionId);
        
        if(result){
            const updatedCourseContent = course.courseContent.map((section)=>{
                return section._id === sectionId? result: section
            });

            const updatedCourse = {...course , courseContent: updatedCourseContent};
            
            dispatch(setCourse(updatedCourse));
        }

        setConfirmationModal(null);
    }

  return (
    <div>
        <div className=' rounded-lg bg-richblack-700 px-8 p-6'>
            {
                course.courseContent.map((section)=>(
                    <details key={section._id} open>
                        <summary className='flex items-center justify-between gap-x-3 border-b-2'>
                            <div className='flex items-center gap-x-3'>
                                <RxDropdownMenu/>
                                <p>{section.sectionName}</p>
                            </div>

                            <div className='flex items-center gap-x-3'>
                                <button onClick={()=> handleChangeEditSectionName(section._id , section.sectionName)}>
                                    <MdEdit/>
                                </button>

                                <button onClick={()=> {
                                    setConfirmationModal({
                                        text1: "Delete this section",
                                        text2: "All lectures in this section will be deleted",
                                        btn1Text: "Delete",
                                        btn2Text: "Cancel",
                                        btn1Handler: ()=> handleDeleteSection(section._id),
                                        btn2Handler: ()=> setConfirmationModal(null),
                                    })
                                }}>
                                    <MdDelete/>
                                </button>
                                <span>|</span>
                                <BiSolidDownArrow className='text-xl text-richblack-300'/>
                            </div>
                        </summary>

                        <div>
                            {
                                section.subSection.map((data)=>(
                                    <div key={data._id} className='flex items-center justify-between gap-x-3 border-b-2'>
                                        <div className='flex items-center gap-x-3' onClick={()=> {setViewSubSection(data)
                                    setEditSubSection(null)
                                    }}>
                                            <RxDropdownMenu/>
                                            <p>{data.title}</p>
                                        </div>

                                        <div className='flex items-center  gap-x-3'>
                                            <button onClick={()=> {setEditSubSection({...data  , sectionId: section._id});
                                                                   setViewSubSection(null);
                                            }}>
                                                <MdEdit/>
                                            </button>

                                            <button onClick={()=> {
                                                setConfirmationModal({
                                                    text1: "Delete this Sub Section",
                                                    text2: "Selected lecture will be deleted",
                                                    btn1Text: "Delete",
                                                    btn2Text: "Cancel",
                                                    btn1Handler: ()=> handleDeleteSubSection(data._id , section._id),
                                                    btn2Handler: ()=> setConfirmationModal(null),
                                                })}}>
                                                <MdDelete/>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                            <button onClick={()=>{setAddSubSection(section._id)
                                                    // setViewSubSection(null);
                                                    // setEditSubSection(null);
                            }}>
                                <FaPlus/>
                                <p>Add Lecture</p>
                            </button>
                        </div>
                    </details>
                ))
            }
        </div>

        {
            addSubSection? (<SubSectionModal
                modalData = {addSubSection}
                setModalData = {setAddSubSection}
                add = {true}
            />): 

            viewSubSection ? (<SubSectionModal
                modalData = {viewSubSection}
                setModalData = {setViewSubSection}
                view = {true}
            />): 

            editSubSection? (<SubSectionModal
                modalData = {editSubSection}
                setModalData = {setEditSubSection}
                edit = {true}
            />) :
             (<div></div>)
        }

        {
            confirmationModal && <ComfirmationModal modalData= {confirmationModal}/>
        }
    </div>
  )
}

export default NestedView