import React, { useEffect, useState } from 'react'
import { IoIosClose } from "react-icons/io";

const ChipInput = ({setValue , errors , register , label , name}) => {

    const [tag , setTag] = useState("");
    const [tagList , setTagList] = useState([]);

    useEffect(()=>{
        register(name , tagList , {required: true , validate: (value)=> value.length>0});

    } , []);

    useEffect(()=>{
        setValue(name , tagList);
    } , [tagList]);

    function tagListHandler(event){
        if(tag && (event.key === ',' || event.key === "Enter")){
            event.preventDefault();
            setTagList([...tagList , tag]);
            setTag("");
        }
    }

    function removeTag(index){
        const updatedTagList = [...tagList];
        updatedTagList.splice(index , 1);
        setTagList(updatedTagList);
    }

  return (
    <div className='flex flex-col gap-y-2'>
        <label htmlFor="tags" className='text-white'>{label}<sup className='text-pink-400'>*</sup></label>
        {   tagList.length>0 &&(
            <div className='flex gap-2 flex-wrap'>
                {tagList.map((tag , index)=>(
                    <div key={index} className='bg-yellow-50 rounded-full w-fit h-fit p-2 flex gap-1 items-center'>
                        {tag}
                        <IoIosClose onClick={()=>removeTag(index)}/>
                    </div>
                ))}
            </div>
        )
        }
        {/*The onKeyDown event is typically triggered first because it is part of the initial sequence of keyboard events that occur when a key is pressed */}
        <textarea id="tags" cols="50" rows="5" value={tag} onKeyDown={tagListHandler} onChange={(e)=> setTag(e.target.value)} placeholder='Enter tags' className='form-style'/>
        {
            errors.name && (
                <span>{label} is Required*</span>
            )
        }
    </div>
  )
}

export default ChipInput