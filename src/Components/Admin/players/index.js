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

const AdminPlayers = () => {

    const [lastVisible, setLastVisible] = useState(null)
    const [loading, setLoading] = useState(false)
    const [players, setPlayers] = useState(null)

    const getLimitedData = async() => {
        const db = getFirestore()
       const q = query(collection(db, "players"), limit(2));
        try {       
        const playersSnap = await getDocs(q)
        const playerVis = await playersSnap.docs[playersSnap.docs.length -1]
            
            const playersParser = playersSnap.docs.map((doc) => {
               return {id:doc.id, ...doc.data()  }               
                }) 
        setLastVisible(playerVis)
        setPlayers(playersParser)
        } catch(err) {
                showToastError(err)
        } finally {
            setLoading(false)
            
        }
    }
    

    useEffect(() => {
      if(!players){
        setLoading(true)
        getLimitedData()
        return true
      }
    }, [players])

    const loadMorePlayers = async() => {
        if(lastVisible){
            setLoading(true)
             const db = getFirestore()
            const q = query(collection(db, "players"),startAfter(lastVisible), limit(2));
            try {
            const playersSnap = await getDocs(q)
            const playerVis = await playersSnap.docs[playersSnap.docs.length -1]
            const playersParser = playersSnap.docs.map((doc) => {
               return {id:doc.id, ...doc.data()  }               
                }) 
                setLastVisible(playerVis)
                setPlayers([...players, ...playersParser])
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
        const toDelete = await deleteDoc(doc(db, "players", id));
        showToastSuccess('File Deleted')
        getLimitedData()
        } catch(error){
            console.log(error)
        } finally{
            setLoading(false)
        }
    }
    
    
  return (
      <AdminLayout title="The Players">
          <div className="mb-5">
              <Button disableElevation variant="outlined" component={Link} to={'/admin_players/add_player'}>
                  Add Player
              </Button>
          </div>
          <Paper className="mb-5">

                    <Table>
                        <TableHead style={{backgroundColor:'lightBlue'}}>
                            <TableRow>
                                <TableCell> First Name </TableCell>
                                <TableCell> Last Name </TableCell>
                                <TableCell> Number </TableCell>
                                <TableCell> Position </TableCell>
                                 <TableCell>  </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {players ? 
                                players.map((player, i) => (
                                    
                               
                                <TableRow key={player.id} style={ i%2 === 0 ? {backgroundColor:'#FAF9F6'} : {backgroundColor:'white'} } >
                                 
                                     <TableCell component={Link} to={`/admin_players/edit_player/${player.id}`}>  {player.name} </TableCell> 
                                    <TableCell component={Link} to={`/admin_players/edit_player/${player.id}`}>  {player.lastname} </TableCell> 
                                    <TableCell component={Link} to={`/admin_players/edit_player/${player.id}`}>  {player.number} </TableCell> 
                                    <TableCell component={Link} to={`/admin_players/edit_player/${player.id}`}>  {player.position} </TableCell> 
                                    <TableCell style={{textAlign:'right', width:'2%', cursor:"pointer"}} onClick={() => handleDelete(player.id)} to={`/admin_players/edit_player/${player.id}`}> <CancelIcon fontSize="large" color="warning"/>  </TableCell> 
                                </TableRow>
                                ))    
                            :null}
                            
                        </TableBody>
                    </Table>

          </Paper>
          <Button variant="contained" disabled={loading} onClick={() => loadMorePlayers()}>
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

export default AdminPlayers