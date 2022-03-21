import React, { useEffect, useReducer, useState } from 'react'

import { showToastError } from '../utils/tools'


import { CircularProgress } from '@mui/material'
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, query } from "firebase/firestore"; 

import Tables from './tables';
import MatchList from './matchList';


const MatchDisplay = () => {

    const [ matches, setMatches] = useState(null)
    const [state, dispatch] = useReducer((prevState, nextState) => {
        return {...prevState,...nextState}
    }, {
        filterMatches:null,
        playedFilter:'All',
        resultFilter:'All'
    })


    const getMatches = async() => {
        if(!matches){
            const db = getFirestore()
            const q = query(collection(db,"matches"))
            try {
             const matchData = await getDocs(q)
             
                const parsedMatches = matchData.docs.map(match => {
                            return {id:match.id,
                                ...match.data()}
          }) 
          setMatches(parsedMatches)
          dispatch({...state, filterMatches:parsedMatches})
        } catch(error){ showToastError(error)}
         
        }
    }

    useEffect(() => {
        getMatches()
    },[matches,state])


    console.log(state.resultFilter, 'sss')

    const showPlayed = (played) => {
        if(state.resultFilter !== 'All') {
            
        const list = matches.filter((match) =>{
                return match.final === played
        }).filter((match) => {
            return match.result === state.resultFilter
        }) 
        dispatch({
                ...state, filterMatches: played === 'All' ? matches.filter((match) => {
                    return match.result === state.resultFilter
                }) : list,
                playedFilter:played,
               //resultFilter:'All'
        }) }
        else {
        const list = matches.filter((match) => {
            return match.final === played
        })
        dispatch({...state, filterMatches: played === 'All' ? matches : list,
                    playedFilter:played })
    }
    }

    const showResult = (result) => {
console.log('hiii', state.playedFilter)
        if(state.playedFilter !== 'All'){
            console.log('hi')
        const list = matches.filter((match) => {
            return match.result === result
        }).filter((match) => {
           
            return match.final === state.playedFilter
        }) 
        dispatch({
                ...state, filterMatches: result === 'All' ? matches.filter((match) => {
                    return match.final === state.playedFilter
                }) : list,        
               // playedFilter:'All',
                resultFilter:result
        })
    } else {
        const list = matches.filter((match) => {
            return match.result === result
        })
        dispatch({...state, filterMatches: result === 'All' ? matches : list,
                    resultFilter:result })
    }
    }


  return (
    <>{matches ?
        <div className="the_matches_container">
                <div className="the_matches_wrapper">
                    <div className="left">
                             <div className="match_filters">
                                 <div className="match_filters_box">
                                            <div className="tag">
                                                Show Matches
                                            </div>
                                
                                 <div className="cont">
                                     <div className={`option ${state.playedFilter === 'All' ? 'active' : null  }`} onClick={() => showPlayed('All')}>All</div> 
                                      <div className={`option ${state.playedFilter === 'Yes' ? 'active' : null  }` } onClick={() => showPlayed('Yes')}>Played</div>  
                                       <div className={`option ${state.playedFilter === 'No' ? 'active' : null  }`} onClick={() => showPlayed('No')}>Not Played</div>     
                                 </div>
                            </div>
                                <div className="match_filters_box">
                                    <div className="tag">
                                                Results
                                            </div>
                                
                                 <div className="cont">
                                     <div className={`option ${state.resultFilter === 'All' ? 'active' : null  }`} onClick={() => showResult('All')}>All</div> 
                                      <div className={`option ${state.resultFilter === 'W' ? 'active' : null  }`} onClick={() => showResult('W')}>W</div>  
                                       <div className={`option ${state.resultFilter === 'L' ? 'active' : null  }`} onClick={() => showResult('L')}>L</div>
                                       <div className={`option ${state.resultFilter === 'D' ? 'active' : null  }`} onClick={() => showResult('D')}>D</div>      
                                 </div>      
                            </div>
                        </div>
                        <MatchList matches={state.filterMatches}/>
                    </div>
                    <div className="right">
                             <Tables/>
                    </div>
                </div>

        </div>
        : <CircularProgress/> }
         </>
  )
}

export default MatchDisplay