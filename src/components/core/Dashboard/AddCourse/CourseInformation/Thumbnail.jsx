import React, { useState } from 'react'

const Thumbnail = ({name , register , errors , label}) => {

    const [imagePreview , setImagePreview] = useState(null);

    function handleImageChange(event){
        const file = event.target.files[0];
        if(file){
            const reader = new FileReader();
            reader.onloadend = ()=>{
                setImagePreview(reader.result);
            }

            reader.readAsDataURL(file);
        }
    }

  return (
    <div>
        {
            imagePreview &&
            <img src={imagePreview} alt="Preview" />
        }
        <label htmlFor="thumbnail">{label}</label>
        <input id='thumbnail' type="file" accept='image/*' {...register(name)}
            onChange={handleImageChange}
        />
        {
            errors[name] && (
                <span>{label} is Required</span>
            )
        }
    </div>
  )
}

export default Thumbnail