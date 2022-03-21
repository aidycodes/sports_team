import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import AdminLayout from '../../HoC/AdminLayout'
import { TextField, Select, MenuItem, FormControl, Button } from '@mui/material'
import { showToastError, showToastSuccess, textErrorHelper, selectErrorHelper, selectIsError } from '../../utils/tools'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { getFirestore } from "firebase/firestore";
import { collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";

import  ImageFormForFirebase from '../../utils/ImageFormForFirebase'

const defaultValues = {
    name:'',
    lastname:'',
    number:'',
    position:'',
    image:'',
    imageName:'',
    id:''
}

const AddEditPlayers = (props) => {

    const [formType, setFormType] = useState('')
    const [values, setValues] = useState(defaultValues)
    const [loading, setLoading] = useState(false)
       
    let params = useParams()
    let navigate = useNavigate();
   

    const formik = useFormik({
        enableReinitialize:true,
        initialValues:values,
        
        validationSchema:Yup.object({
            name:Yup.string().required('This input is required'),
            lastname:Yup.string().required('This input is required'),
            number:Yup.number().required('This input is required').min(0,'The Minium is 0').max(99,'The max is 99'),
            position:Yup.string().required('This input is required'),
            image:Yup.string().required('Please Upload an Image First'),
            imageName:Yup.string(),
            id:Yup.string()
        }),
        onSubmit:(values)=>{
       
            addEditPlayer(values)
           
            
        }
    })

    const imageHandle = () => {
  //  
    }

const addEditPlayer = async(values) => {
    const db = getFirestore()
    setLoading(true)
   
  if(formType === 'Add'){
      try{
     const docRef = await addDoc(collection(db, "players"), {...values})
      const addId = await setDoc(doc(db, "players", docRef.id), {...values, id:docRef.id})
      showToastSuccess('Player Added')
      formik.resetForm(defaultValues)
      console.log("document written with ID", docRef.id)
      navigate("/admin_players")
      }catch(error) {showToastError(error)}
       finally { setLoading(false)}
  } else {
      try{
     const docRef = await setDoc(doc(db, "players", params.id), {...values})     
      showToastSuccess('Player Edit Successful')
      navigate("/dashboard")
      }catch(error) { showToastError(error)}
       finally { setLoading(false)}
    
  }
} 

const fetchData = async(docRef) => {
    try{
        const docSnap = await getDoc(docRef);
            if(docSnap.data()){
                setValues(docSnap.data())
        } else {
                showToastError('Player Not Found')
        }
    } 
        catch(error){showToastError(error)}

}
    

    useEffect(() => {
      if(params.id){
        setFormType('Edit')
        const db = getFirestore()
        const docRef = doc(db, "players", params.id);
        fetchData(docRef)
      } else {
        setFormType('Add')
      }
    }, [])




  return (
      <AdminLayout title={formType === 'Edit' ? <div>Edit Player</div> : <div>Add Player</div>}>
          <div className="editplayers_dialog_wrapper">
              <div>
                  <form onSubmit={formik.handleSubmit}>

                            <FormControl error={selectIsError(formik, 'image')}>
                            <ImageFormForFirebase formik={formik} values={values}   />
                             {selectErrorHelper(formik, 'image')}
                            </FormControl>
                            <hr/>
                            <h4>Player Info</h4>
                            <div className="mb-5">
                                <FormControl>
                                    <TextField id="name" name="name" variant="outlined" placeholder='Add Firstname'
                                    {...formik.getFieldProps('name')} {...textErrorHelper(formik, 'name')}
                                    />
                                </FormControl>
                            </div>
                            <div className="mb-5">
                                <FormControl>
                                    <TextField id="lastname" lastname="lastname" variant="outlined" placeholder='Add Lastname'
                                    {...formik.getFieldProps('lastname')} {...textErrorHelper(formik, 'lastname')}
                                    />
                                </FormControl>
                            </div>
                            <div className="mb-5">
                                <FormControl>
                                    <TextField id="number" number="number" type="number" variant="outlined" placeholder='Add number'
                                    {...formik.getFieldProps('number')} {...textErrorHelper(formik, 'number')}
                                    />
                                </FormControl>
                            </div>
                            <div className="mb-5">
                                <FormControl error={selectIsError(formik, 'position')} >
                                    <Select id="position" name="position" variant="outlined" displayEmpty
                                    {...formik.getFieldProps('position')}
                                    >

                                        <MenuItem value="" disabled>Select Position</MenuItem>
                                        <MenuItem value="Keeper">Keeper</MenuItem>
                                        <MenuItem value="Defence">Defence</MenuItem>
                                        <MenuItem value="Midfield">Midfield</MenuItem>
                                        <MenuItem value="Striker">Striker </MenuItem>
                                       
                                    </Select>
                                    {selectErrorHelper(formik, 'position')}
                                </FormControl>
                            </div>
                       
                        <Button type="submit"  variant='contained' color="primary" disabled={loading}>
                            {formType === 'Add' ?
                            'Add Player'    
                        : 'Edit Player'
                        }
                        </Button>

                  </form>

              </div>
          </div>
   
    </AdminLayout>
  )
}

export default AddEditPlayers