import React from 'react';

import {Link} from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

import teamlogo from '../../Resources/images/logos/manchester_city_logo.png'
import { toast } from 'react-toastify';

import { FormHelperText } from '@mui/material';


export const TeamLogoMain = ( {link, linkTo, width, height }) => {

    const template = <div
        className="img_cover"
        style={{width:width, height:height, background:`url(${teamlogo}) no-repeat`}}>
    </div>

    if(link){
        return(
          <Link to={linkTo}>{template}</Link>  
        )}
        else{
            return template
        }
    }

export const Tag = (props) => {
    const temp = <div style={{
        background: props.bck || 'white',
        fontSize: props.size || '1.5rem',
        color: props.color || 'black',
        padding: '5px 10px',
        display:'inline-block',
        fontFamily:'Righteous',
        ...props.add 
    }}>
        {props.children}
    </div>
    if(props.linkTo){
        return(
            <Link to={props.linkTo}>
                {temp}
            </Link>
        )
    } return(
        <>
        {temp}
        </>
    )
}

export const showToastError = (msg, type) => {
    toast.error(msg,{
        position:toast.POSITION.TOP_LEFT
    })
}
export const showToastSuccess = (msg, type) => {
    toast.success(msg,{
        position:toast.POSITION.TOP_LEFT
    })
}

export const handleLogout = () => {
    const auth = getAuth()
    signOut(auth).then(() => {
     showToastSuccess('Signed Out')
    }).catch(error =>{
      showToastError(error.message)
    })
  }


export const textErrorHelper = (formik, values) => (
    {
        error:formik.errors[values] && formik.touched[values],
        helperText:formik.errors[values] && formik.touched[values] ? formik.errors[values] : null
    }
    
)

export const selectErrorHelper = (formik, values) => {
    if(formik.errors[values] && formik.touched[values]){
        return (
                <FormHelperText style={{color:'red'}}>{formik.errors[values]}</FormHelperText>
        )
    } 
    return false;
}

export const selectIsError = (formik, values) => {
    return formik.errors[values] && formik.touched[values]
}
      