import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CancelIcon from '@mui/icons-material/Cancel';

import { Button, 
    Table, 
    TableBody, 
    TableCell, 
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    

} from '@mui/material'

import AdminLayout from '../../HoC/AdminLayout'

import { getFirestore } from "firebase/firestore";
import { collection, getDocs, query, limit, startAfter, doc, deleteDoc} from "firebase/firestore"; 

import { showToastError, showToastSuccess } from '../../utils/tools';

const AdminMatches = () => {

    const [lastVisible, setLastVisible] = useState(null)
    const [loading, setLoading] = useState(false)
    const [matches, setMatches] = useState(null)

    const getLimitedData = async() => {
        const db = getFirestore()
       const q = query(collection(db, "matches"), limit(5));
        try {       
        const matchesSnap = await getDocs(q)
        const matchVis = await matchesSnap.docs[matchesSnap.docs.length -1]
            
            const matchesParser = matchesSnap.docs.map((doc) => {
               return {id:doc.id, ...doc.data()  }               
                }) 
        setLastVisible(matchVis)
        setMatches(matchesParser)
        } catch(err) {
                showToastError(err)
        } finally {
            setLoading(false)
            
        }
    }
    console.log(matches)

    useEffect(() => {
      if(!matches){
        setLoading(true)
        getLimitedData()
        return true
      }
    }, [matches])

    const loadMorematches = async() => {
        if(lastVisible){
            setLoading(true)
             const db = getFirestore()
            const q = query(collection(db, "matches"),startAfter(lastVisible), limit(2));
            try {
            const matchesSnap = await getDocs(q)
            const matchVis = await matchesSnap.docs[matchesSnap.docs.length -1]
            const matchesParser = matchesSnap.docs.map((doc) => {
               return {id:doc.id, ...doc.data()  }               
                }) 
                setLastVisible(matchVis)
                setMatches([...matches, ...matchesParser])
            } catch(err) {
                showToastError(err)
            } finally {
                setLoading(false)
            }

        } else {
            showToastError('nothing to load')
        }
    }

    const handleDelete = async(id) => {
         const db = getFirestore()
        try{
            setLoading(true)
        const toDelete = await deleteDoc(doc(db, "matches", id));
        showToastSuccess('Match Deleted')
        getLimitedData()
        } catch(error){
            console.log(error)
        } finally{
            setLoading(false)
        }
    }
    
    
  return (
      <AdminLayout title="The matches">
          <div className="mb-5">
              <Button disableElevation variant="outlined" component={Link} to={'/admin_matches/add_match'}>
                  Add match
              </Button>
          </div>
          <Paper className="mb-5">

                    <Table>
                        <TableHead style={{backgroundColor:'lightBlue'}}>
                            <TableRow>
                                <TableCell> Date </TableCell>
                                <TableCell> Match </TableCell>
                                <TableCell> Result </TableCell>
                                <TableCell> Final </TableCell>
                                 <TableCell>  </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {matches ? 
                                matches.map((match, i) => (
                                    
                               
                                <TableRow key={match.id} style={ i%2 === 0 ? {backgroundColor:'#FAF9F6'} : {backgroundColor:'white'} } >
                                 
                                     <TableCell component={Link} to={`/admin_matches/edit_match/${match.id}`}>  {match.date} </TableCell> 
                                    <TableCell component={Link} to={`/admin_matches/edit_match/${match.id}`}>  {match.away} <strong style={{padding:'1em'}}>v</strong> {match.local}  </TableCell> 
                                    <TableCell component={Link} to={`/admin_matches/edit_match/${match.id}`}>  {match.resultAway} <strong>-</strong> {match.resultLocal} </TableCell> 
                                    <TableCell component={Link} to={`/admin_matches/edit_match/${match.id}`}>  {match.final === 'Yes' ? 
                                    <span className="matches_tag_green">Final</span> : <span className="matches_tag_red">Not played yet</span>  } </TableCell> 
                                    <TableCell style={{textAlign:'right', width:'2%', cursor:"pointer"}} onClick={() => handleDelete(match.id)} to={`/admin_matches/edit_match/${match.id}`}> <CancelIcon fontSize="large" color="warning"/>  </TableCell> 
                                </TableRow>
                                ))    
                            :null}
                            
                        </TableBody>
                    </Table>

          </Paper>
          <Button variant="contained" disabled={loading} onClick={() => loadMorematches()}>
              Load More
          </Button>

          <div className="admin_progress">
              {loading ? 
                        <CircularProgress thickness={7} style={{color:'#98c5e9'}}/>
              :null}
          </div>
    </AdminLayout>
  )
}

export default AdminMatches