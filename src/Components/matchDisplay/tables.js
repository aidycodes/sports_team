import React, { useEffect, useState } from 'react'

import { showToastError } from '../utils/tools'


import { CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, query } from "firebase/firestore"; 

const Tables = () => {

    const [ position, setPosition ] = useState(null)

    const getPositionData = async() =>{
        if(!position){
            const db = getFirestore()
            const q = query(collection(db,"positions"))
            try {
             const positionData = await getDocs(q)
             
                const parsedPosition = positionData.docs.map(pos => {
                            return {id:pos.id,
                                ...pos.data()}
          }) 
          setPosition(parsedPosition.sort((a, b) => (b.pts) - (a.pts)))
        } catch(error){ showToastError(error)}       
        }
    }                                   

    const showTeamPositions = () => (
        position ? 
            position.map((pos,i) => (
                
              <TableRow key={i}>
                    <TableCell>{i+1}</TableCell>
                    <TableCell>{pos.team}</TableCell>
                    <TableCell>{pos.w}</TableCell>
                    <TableCell>{pos.d}</TableCell>
                    <TableCell>{pos.l}</TableCell>
                     <TableCell>{pos.pts}</TableCell>
                </TableRow>
            ))
            :null
    )

    useEffect(() => {
        getPositionData()
    },[position])


  return (
    <>
    <div className="league_table_wrapper">
        <div className="title">
            League Table
        </div>
        <div>
        <Table>
            <TableRow>
                <TableCell>Pos</TableCell>
                <TableCell>Team</TableCell>
                <TableCell>W</TableCell>
                <TableCell>L</TableCell>
                <TableCell>D</TableCell>
                <TableCell>Pts</TableCell>
            </TableRow>
            <TableBody>
                    { showTeamPositions()}
            </TableBody>
        </Table>
        </div>
    </div>
    </>
  )
}

export default Tables