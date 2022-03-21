import React from 'react';
import { Link } from 'react-router-dom';
import { ListItem } from '@mui/material';
import { handleLogout } from '../../utils/tools';
import { withRouter } from '../../routing/withRouter';




const AdminNav = (props) => {

    const links = [
        {
            title:'Matches',
            linkTo:'/admin_matches'
        },
                {
            title:'Players',
            linkTo:'/admin_players'
        },
    ]

    const renderLinks = links.map((link) => {
        return (
         <Link to={link.linkTo} key={link.title}>
                <ListItem button className="admin_nav_link">{link.title}</ListItem>

                </Link>
        )
    })
  
    

  return (
   <>
   {renderLinks}
    <ListItem button onClick={() => handleLogout()} className="admin_nav_link">Log Out</ListItem>

    
   </>
  )
}

export default withRouter(AdminNav);