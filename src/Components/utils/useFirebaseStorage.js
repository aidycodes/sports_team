import { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

import moment from 'moment'

import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage"

export const useStorage = (file) => {
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);
    const [imageName, setImageName] = useState(null)
    const [loading, setLoading] = useState(false)
   

    // runs every time the file value changes
    useEffect(() => {   
       
        if (file) {
          const snap = fileUploader(file)
            }                                  
    }, [file]);

    const params = useParams()

    const fileUploader = async(file) => {
          setLoading(true)           
            const storage = getStorage();
            const fileName = moment().format('MMMM Do YYYY, h:mm:ss a')
            const imagesRef = ref(storage, `images/players/${fileName}`)
            const upload = uploadBytesResumable(imagesRef, file) 
             upload.on('state_changed', (snapshot) => {
                
                const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(uploadProgress);
                console.log(uploadProgress)

            }, (error) => {
                    setError(error)
            }, async() => {
                try{
            const downloadURL = await getDownloadURL(upload.snapshot.ref)
            setImageName(fileName)
            setUrl(downloadURL)
                 console.log('File available at', downloadURL);
                 
              }finally{
                  setLoading(false)
                  setProgress(0)
                  //setUrl(null)
                  setError(null)
              }
                                             
              

})

    }

    return { progress, url, loading, error, imageName  };
};

/*
.then((snapshot) => {
                    console.log('Uploaded a blob or file!');
                   const pathReference = ref(storage, snapshot.fullpath) 
                   console.log(pathReference)
                   */