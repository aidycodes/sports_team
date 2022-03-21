import React, {useState, useEffect} from 'react';
import { Slide } from 'react-awesome-reveal';
import { getFirestore } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore"; 
import MatchesBlock from '../../utils/matches_block';

const Blocks = () => {

    const [matches, setMatches] = useState([])


const getData = async(collectionName) => {
    const db = getFirestore()
    const docSnap = await getDocs(collection(db, collectionName)).catch((err) => console.log(err));
    const snapshot = docSnap.docs.map((doc) => (
        { id:doc.id, ...doc.data() }
       )); 
      
    setMatches(snapshot) 
       
    }
    
    useEffect(() => {
      getData('matches')     
    }, [])

    const showMatches = (matches) => {
      return(
      matches ?
      matches.map((match) => {
        return (
          <Slide bottom key={match.id} className="item" triggerOnce={true}>
            <div>
              <div className="wrapper">
          <MatchesBlock match={match}/>
              </div>
            </div>
          </Slide>
        )
      }) : null
      )}
    

  return (
    <div className={"home_matches"}> {showMatches(matches)}</div>
  )
}

export default Blocks