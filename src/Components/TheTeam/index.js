import React, { useEffect, useState } from 'react'

import PlayerCard from '../utils/playerCard'

import { Slide } from 'react-awesome-reveal'
import { showToastError, showToastSuccess } from '../utils/tools'
import { CircularProgress } from '@mui/material'

import { getFirestore } from "firebase/firestore";
import { collection, query, where, getDocs, docs } from "firebase/firestore"; 

const TheTeam = () => {

    const [ loading, setLoading] = useState(true)
    const [players, setPlayers ] = useState(null)

    useEffect(async() => {
      if(!players){
          const db = getFirestore()
          const q = query(collection(db, "players"));
          try {
          const querySnapshot = await getDocs(q);
        const mappedSnap =  querySnapshot.docs.map((doc) => {
                return {...doc.data()}
          })
        setPlayers(mappedSnap)
          } catch(error){
              showToastError('players cannot be loaded at this time')
              console.log(error)
          } finally{
              setLoading(false)
          }
      }
    
    }, [players])

    const showPlayerByPosition = (position) => (
        players ?        
           players.filter((player) => player.position == position )         
             .map((player) => {
                  return(  
                      <Slide left key={player.id} triggerOnce>
                     <div className="item">
                         <PlayerCard
                         name={player.name}
                         number={player.number}
                         lastname={player.lastname}
                         bck={player.image}
                         />
                     </div>
                     </Slide>
                  )            
             })
        :null
    )
               
    
    
console.log(players)
  return (
    <div className="the_team_container">
        {loading ? <div className="progress"> <CircularProgress/> </div>    
        :
        <>
            <div className="team_category_wrapper">
                    <div className="title" style={{fontSize:'6rem', fontWeight:'800', color:'lightBlue'}}>Keepers</div>
                    <div className="team_cards">
                        {showPlayerByPosition('Keeper')} 
                    </div>
            </div>
                        <div className="team_category_wrapper">
                    <div className="title" style={{fontSize:'6rem', fontWeight:'800', color:'lightBlue'}}>Defence</div>
                    <div className="team_cards">
                        {showPlayerByPosition('Defence')} 
                    </div>
            </div>
            <div className="team_category_wrapper">
                    <div className="title" style={{fontSize:'6rem', fontWeight:'800', color:'lightBlue'}}>Midfield</div>
                    <div className="team_cards">
                        {showPlayerByPosition('Midfield')} 
                    </div>
            </div>

            <div className="team_category_wrapper">
                    <div className="title" style={{fontSize:'6rem', fontWeight:'800', color:'lightBlue'}}>Strikers</div>
                    <div className="team_cards">
                        {showPlayerByPosition('Striker')} 
                    </div>
            </div>

            
</>
        }
    </div>
  )
}

export default TheTeam