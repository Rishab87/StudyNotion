import React, { useEffect, useState } from 'react'

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

        <label htmlFor={name}>{label}<sup>*</sup></label>
        <div>
            <input type='text' id={name} value={requirement} onChange={(e)=> setRequirement(e.target.value)} className='w-full'/>
            <button onClick={handleAddRequirement} className='font-semibold text-yellow-50'>Add</button>
        </div>
        {
            requirementList.length> 0 && (
                <ul>
                    {
                        requirementList.map((requirement , index)=>(
                            <li key={index} className='flex items-center text-richblack-5'>
                                <span>{requirement}</span>
                                <button onClick={()=> handleRemoveRequirement(index)} className='text-xs text-pure-greys-300'>clear</button>
                            </li>
                        ))
                    }
                </ul>
            )
        }
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