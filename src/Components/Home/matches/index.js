import React from 'react'
import { Tag } from '../../utils/tools'
import  Blocks  from './Blocks'

const MatchesMain = () => {
  return (
 <>
    <div className="home_matches_wrapper">
        <div className="container">
            <Tag
            bck="#0e1731"
            size="50px"
            color="#ffffff"
            add={{borderRadius:'20px'}}>
                Matches
            </Tag>

            <Blocks/> 

            <Tag
            size="22px"
            color="#0e1731"
            linkTo="/the_team"
            >
                The Team
            </Tag>

        </div>
    </div>
</>
  )
}

export default MatchesMain