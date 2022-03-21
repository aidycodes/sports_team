import React from 'react'
import { Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth'

const AuthGuard = (Component) => {
    class AuthHoc extends React.Component{

        authCheck = () => {
            const auth = getAuth()
            const user = auth.currentUser;
           
            if(user){
                    return <Component {...this.props}/>
            } else{
                return <Navigate to="/sign_in"/>
            }
        }

        render(){
           return this.authCheck()
        }

    }
    return AuthHoc;
}

export default AuthGuard