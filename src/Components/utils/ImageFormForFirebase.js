import React, { useState, useEffect, forwardRef, useImperativeHandle  } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { CircularProgress, Button } from '@mui/material'
import { showToastError, showToastSuccess } from './tools'

import { useStorage } from './useFirebaseStorage'
import { getStorage, ref, deleteObject } from "firebase/storage";
import { doc, setDoc, getFirestore } from "firebase/firestore"; 

const ImageFormForFirebase = ({ formik, values }) => {

    const [file, setFile] = useState(null);
    const [filePath, setFilePath] = useState(null)
    const [typeError, setTypeError] = useState(null);
    const [imageDisplay, setImageDisplay] = useState(null)

    const [hotfix, setHotfix] = useState(false)
  

    const { progress, url, loading, error, imageName } = useStorage(file)

    const params = useParams()
    let navigate = useNavigate()

useEffect(() =>{
   
    setImageDisplay(values.image)

},[values, hotfix])
console.log(values)
    const types = ["image/png", "image/jpeg", "image/jpg"];

    const handleChange = (e) => {
        let selectedFile = e.target.files[0];

        if (selectedFile) {
            if (types.includes(selectedFile.type)) {
                setTypeError(null);
                setFilePath(selectedFile);
           //     formik.setFieldValue('image', 'pending')
            } else {
                setFile(null);
                setTypeError("Please select an image file (png or jpg)");
            }
        }
    };



       const handleSubmit = ()  => {  
            setFile(filePath) 
    }
   

    const handleDelete = async() => {
        const db = getFirestore()
        const storage = getStorage();    
        const imgRef = ref(storage, `images/players/${values.imageName}`);

        await setDoc(doc(db, "players", values.id), {
                                ...values,
                                imageName:'',
                                image:''
                                });
        
        try {
            const deleted = await deleteObject(imgRef)
            setImageDisplay(null)
            
        } catch(error) { console.log(error)}



    }

    useEffect(() => {
      if(error){
            showToastError(error)
      } if (url){
      
          showToastSuccess('Upload Successful')
          updateImageName(url, imageName)
          setImageDisplay(url)
      }
    
 
    }, [error, url])

    const updateImageName = (fileName, imageName) =>{
        formik.setFieldValue('image', fileName)
        formik.setFieldValue('imageName', imageName)
    }
 

    return (
        <div className="App">
             {imageDisplay ? <div className="image_upload_container">
                <img src={imageDisplay} style={{width:'100%'}} />
                <div className="remove">
                    <Button onClick={() => handleDelete()}>Remove</Button>
                </div>
            </div> 
            :
            <form>
                <label>
                    <input type="file" onChange={handleChange} />
                    <Button onClick={() => handleSubmit()} variant='contained' disabled={loading}    >Upload Image</Button>
                    {loading ? <CircularProgress/> :null}
                </label>
            </form> }
           
        </div>
    );
}


export default ImageFormForFirebase