import React from 'react'
import {AppBar, Toolbar, Button} from '@mui/material';
import {Link} from 'react-router-dom';
import { TeamLogoMain } from '../utils/tools'
import {  handleLogout } from '../utils/tools';



const Header = ( { user }) => {
 
  return (
    <>
    <AppBar position="fixed"
      style={{backgroundColor:'#98c5e9',
    boxShadow:'none',
    padding:'0.8em 0',
    borderBottom:'2px solid #00285e'}}> 

    <Toolbar style={{display:"flex"}}>
      <div style={{flexGrow:1}}>
      
       <TeamLogoMain link={true} linkTo={'/'} width="70px" height="70px"/>
      
      </div>
      <Link to="/the_team">
        <Button color="inherit">The Team</Button>
      </Link>
       <Link to="/matches">
        <Button color="inherit">Matches</Button>
      </Link>
      {user ? 
      <>
       <Link to="/dashboard">
        <Button color="inherit">Dashboard</Button>
      </Link>
     
        <Button color="inherit" onClick={() => handleLogout()}>Log Out</Button>
    
    
      </>
          : null
}
    </Toolbar>
    
    </AppBar>
    </>
  )
}

export default Header;