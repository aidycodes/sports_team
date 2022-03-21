import React, { useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import { CircularProgress } from '@mui/material'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs, where, query } from "firebase/firestore"; 

import { showToastError, showToastSuccess } from '../../utils/tools'
import { getData, uploadDataSetToDb } from '../../../firebase/firebase'

const Enroll = () => {

    const [ loading, setLoading] = useState(false)

    const formik = useFormik({
        initialValues:{email:''},
        validationSchema: Yup.object({
            email:Yup.string().email('Invalid Email')
             .required('The email is required')
        }),
        onSubmit:(value, { resetForm } ) => {
            setLoading(true);
            submitForm(value, resetForm)
        }
    })

    const submitForm = async(values, reset) => {
         const db = getFirestore()
        try{
            const q = query(collection(db, 'promotions'), where('email', '==', values.email)) 
            const querySnapshot = await getDocs(q)
           
            if (querySnapshot.docs.length >= 1) {
                showToastError('Email Address is Already Registered')
                setLoading(false)
                return false
            } {
             await addDoc(collection(db, 'promotions'), {email:values.email})   
            showToastSuccess('Email Address Added')
            setLoading(false)
            reset()
            }
        } catch(err){
            showToastError(err)
        }
    }

  return (
    <Fade>
        <div className="enroll_wrapper">
            <form onSubmit={formik.handleSubmit}>
                <div className="enroll_title">
                    Enter Your Email
                </div>
                <div className="enroll_input">
                    <input name="email" 
                            onChange={formik.handleChange} 
                            onBlur={formik.handleBlur} 
                            value={formik.values.email} 
                            placeholder="Email Adress"/>

                                {formik.touched.email && formik.errors.email ? 
                                <div className="error_label">{formik.errors.email} </div>
                                :null}

                            {loading ? 
                            <CircularProgress color="secondary" className="progress"/>
                        :<button type="submit">Enroll Now</button>}

                        <div className="enroll_discl">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit atque doloribus labore numquam cum quod sit error, ullam tenetur nemo eveniet nesciunt veritatis sed perferendis unde quibusdam accusamus, recusandae quam.
                        </div>

                            
                </div>
            </form>
        </div>
    </Fade>
        
  )
}

export default Enroll