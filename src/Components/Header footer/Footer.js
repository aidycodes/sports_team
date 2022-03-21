import React from 'react'
import { TeamLogoMain } from '../utils/tools'

const Footer = () => {
  return (

    <footer className="bck_blue">
      <div className="footer_logo">
        <TeamLogoMain link={true} linkTo={'/'} width="70px" height="70px"/>

      </div>
      <div className="footer_desc1">
        Random Footer 2022 All Rights Reserved
      </div>
    </footer>

  )
}

export default Footer