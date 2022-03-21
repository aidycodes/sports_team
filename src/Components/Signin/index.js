import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";
import initializeApp from '../../firebase/firebase'
import { CircularProgress } from '@mui/material';
import { showToastError, showToastSuccess } from '../utils/tools';

import { useFormik } from 'formik'
import * as Yup from 'yup'

const SignIn = (props) => {

    const [loading, setLoading] = useState(false);

    console.log(props.user, 'lll')

    const formik = useFormik({
        initialValues:{
            email:'aidycodes@gmail.com',
            password:'test123'
        },
        validationSchema:Yup.object({
            email:Yup.string().email('Invalid email address').required('The Email is Required'),
            password:Yup.string().required('The Password is Required')
        }),
        onSubmit: (values)=>{
            setLoading(true)
            submitForm(values)

        }
    })

 let navigate = useNavigate()

   

    const submitForm = (values) => {
        const auth = getAuth();
      
        signInWithEmailAndPassword(auth, values.email, values.password).then((userCredential) => {
              const user = userCredential.user;
              
              showToastSuccess('Welcome back ' + user.email)
               
            navigate('/dashboard');
            

        }).catch(error => {
           
            setLoading(false)   
            showToastError('Incorrect Username Or Password')
        })
    }

  return (
    
    <>
    
  
    {!props.user ? 
    <div className="container">
        <div className="signin_wrapper" style={{margin:'100px'}}>
            <form onSubmit={formik.handleSubmit}>
                <h2>Please Login</h2>
                <input 
                        name="email"
                        placeholder="Email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        />
                        {formik.touched.email && formik.errors.email ? 
                        <div className="error_label">
                            {formik.errors.email}
                        </div>:null }

                <input 
                        name="password"
                        placeholder="Enter Password"
                        type="Password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        />
                           {formik.touched.password && formik.errors.password ? 
                        <div className="error_label">
                            {formik.errors.password}
                        </div>:null }
                        
                        {loading ? <CircularProgress color="secondary" className="progress"/> :   <button type="submit">Log in</button>         }

                             


            </form>
        </div>
    </div>
    : <Navigate to="/dashboard"/>
                           }
  </>
  )
}


export default SignIn