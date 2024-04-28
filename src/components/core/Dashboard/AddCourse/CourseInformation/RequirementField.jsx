import React, { useEffect, useState } from 'react'
import { RxCross2 } from "react-icons/rx";

const RequirementField = ({name , label , register , setValue , errors , getValues }) => {

    const [requirement , setRequirement] = useState("");
    const [requirementList , setRequirementList] = useState([]);

    const handleAddRequirement = (event)=>{
        event.preventDefault();
        if(requirement){
            setRequirementList([...requirementList , requirement]);
            setRequirement("");
        }
    }

    const handleRemoveRequirement = (index)=>{
        const updatedRequirementList = [...requirementList];
        updatedRequirementList.splice(index , 1);
        setRequirementList(updatedRequirementList);
    }

    useEffect(()=>{
        register(name , {
            required: true , 
            validate: (value)=> value.length>0
        })
    } ,[])

    useEffect(()=>{
        setValue(name , requirementList);
    } , [requirementList]);

  return (
    <div>

        <label htmlFor={name} className='text-white'>{label}<sup className='text-pink-400'>*</sup></label>
        {
            requirementList.length> 0 && (
                <ul className='flex flex-col gap-2 mb-2'>
                    {
                        requirementList.map((requirement , index)=>(
                            <li key={index} className='flex items-center text-richblack-5 gap-2'>
                                <span>{requirement}</span>
                                <button onClick={()=> handleRemoveRequirement(index)} className='text-xs text-pure-greys-300'><RxCross2/></button>
                            </li>
                        ))
                    }
                </ul>
            )
        }
        <div className='flex gap-3'>
            <input type='text' id={name} value={requirement} onChange={(e)=> setRequirement(e.target.value)} className='form-style w-full'/>
            <button onClick={handleAddRequirement} className='font-semibold text-yellow-50'>Add</button>
        </div>

        {
            errors[name] && (
                <span>
                    {label} is Required*
                </span>
            )
        }
    </div>
  )
}

export default RequirementField