import React from 'react';
import ReactDOM from 'react-dom';
import AppRoutes from './routes';
import './Resources/css/app.css'
import {getAuth, onAuthStateChanged } from "firebase/auth";

const App = (props) => {
  return (
        <AppRoutes {...props} />
  )
}

const auth = getAuth()


onAuthStateChanged(auth,(user) => {
        ReactDOM.render(
  <App user={user}/>,
  document.getElementById('root')
);

})