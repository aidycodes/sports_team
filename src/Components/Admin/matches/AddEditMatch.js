import React, { useEffect, useState } from 'react'
import AdminLayout from '../../HoC/AdminLayout'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { useParams } from 'react-router-dom'

import { showToastError, showToastSuccess, selectErrorHelper, selectIsError, textErrorHelper } from '../../utils/tools'

import { TextField, Select, MenuItem, FormControl, Button } from '@mui/material'

import { getFirestore } from 'firebase/firestore'
import { collection, query, getDocs, getDoc, doc, setDoc, addDoc  } from "firebase/firestore";

const defaultValues = {
    date:'',
    local:'',
    resultLocal:'',
    away:'',
    resultAway:'',
    referee:'',
    result:'',
    stadium:'',
    final:''
}

const AddEditMatch = () => {

    const [ loading, setLoading] = useState(false);
    const [formType, setFormType] = useState('');
    const [teams, setTeams] = useState(null);
    const [ values, setValues] = useState(defaultValues)

    const params = useParams();

    const formik = useFormik({
        enableReinitialize:true,
        initialValues:values,
        validationSchema:Yup.object({
            date:Yup.string().required('Feild is Required'),
            local:Yup.string().required('Feild is Required'),
            resultLocal:Yup.number().required('Feild is Required').min(0, 'Postive Numbers Only').max(999, 'Max Entry is 999'),
            away:Yup.string().required('Feild is Required'),
            resultAway:Yup.number().required('Feild is Required').min(0, 'Postive Numbers Only').max(999, 'Max Entry is 999'),
            referee:Yup.string().required('This input is required'),
            stadium:Yup.string().required('This input is required'),
            result:Yup.mixed().required('This input is required').oneOf(['W','D','L','N/A']),
            final:Yup.mixed().required('This input is required').oneOf(['Yes','No'])
        }),
        onSubmit:(values) => {
            // logic
            submitForm(values)
        }
    })

    const showTeams = () => (
        teams ? 
        teams.map((team) => (
                <MenuItem key={team.id} value={team.shortName}>{team.shortName}</MenuItem>
        ))
        :null
    )

const submitForm = async(values) => {
    
    const db = getFirestore()
    const dataToSubmit = values
    teams.forEach((team) => {
        if (team.shortName === dataToSubmit.local){
            dataToSubmit['localThmb'] = team.thmb
        }
        if (team.shortName === dataToSubmit.away){
            dataToSubmit['awayThmb'] = team.thmb
        }
    })
    setLoading(true);
        if (formType === 'add'){    
            try{          
        const addData = await addDoc(collection(db, "matches"), 
        {...dataToSubmit})
      
            showToastSuccess('Match Added')
            formik.resetForm(defaultValues)
        }  catch(error){
            showToastError(error)
        } finally {
            setLoading(false)
        }
    }
    if (formType === 'edit'){
        try{         
        const addData = await setDoc(doc(db, "matches", params.id), 
        {...dataToSubmit})  
            showToastSuccess('Match Updated')
            formik.resetForm(defaultValues)
        }  catch(error){
            showToastError(error)
        } finally {
            setLoading(false)
        }
    }
        
}          
 //Last bit i changed
        const getTeamList = async() => {
        if(!teams){
            const db = getFirestore()
            const q = query(collection(db, "teams"));
                try{
                const querySnapshot = await getDocs(q);
                const teamList = querySnapshot.docs.map((doc) => {
                 return {id:doc.id, ...doc.data()}
                })
                setTeams(teamList)
                }catch(error){
                    showToastError('Team List Cannot Be Loaded')
                    console.log(error)
                }
        }
    }
    const getSingleDoc = async() => {
            if(params.id){
            setFormType('edit')
             const db = getFirestore()
            const docRef = doc(db, "matches", params.id);
            try{
                const docSnap = await getDoc(docRef);
                if(docSnap.data()){
                setValues(docSnap.data())
                } else {
                    showToastError('Document Not Found')
                }
            } catch { showToastError('Database Error')}

        }else{
            setFormType('add')
            setValues(defaultValues)
        }
    }
    useEffect(() => {
        getTeamList()
    },[teams])

    useEffect(() => {
        getSingleDoc()

    },[params.id])
//to here

  return (
    <AdminLayout title={formType == 'add' ? 'Add Match' : 'Edit Match'}>
        <div className="editmatch_dialog_wrapper">
            <div>
                <form onSubmit={formik.handleSubmit}>
                    <div>
                        <h4>Select Date</h4>
                        <FormControl>
                            <TextField id="date" name="date" type="date"
                            {...formik.getFieldProps('date')} {...textErrorHelper(formik, 'date')}
                            />
                        </FormControl>
                    </div>
                      <hr/>
                      <div>
                          <h4>Result Local</h4>
                          <FormControl error={selectIsError(formik, 'local')}>
                              <Select
                              id="local" name="local" variannt="outlined" displayEmpty
                               {...formik.getFieldProps('local')}>
                                  <MenuItem value="" disabled>Select A Team</MenuItem>
                                  {showTeams()}
                              </Select>
                              {selectErrorHelper(formik, 'local')}
                          </FormControl>

                          <FormControl style={{marginLeft:'10px'}}>
                            <TextField id="resultLocal" name="resultLocal" type="number" variant='outlined'
                            {...formik.getFieldProps('resultLocal')} {...textErrorHelper(formik, 'resultLocal')}
                            />
                        </FormControl>
                      </div>
                       <div>
                          <h4>Result Away</h4>
                          <FormControl error={selectIsError(formik, 'away')}>
                              <Select
                              id="away" name="away" variant="outlined" displayEmpty
                               {...formik.getFieldProps('away')}>
                                  <MenuItem value="" disabled>Select A Team</MenuItem>
                                  {showTeams()}
                              </Select>
                              {selectErrorHelper(formik, 'away')}
                          </FormControl>

                          <FormControl style={{marginLeft:'10px'}}>
                            <TextField id="resultAway" name="resultAway" type="number" variant='outlined'
                            {...formik.getFieldProps('resultAway')} {...textErrorHelper(formik, 'resultAway')}
                            />
                        </FormControl>
                      </div>
                      <hr/>
                      <div>
                        <h4>Match Info</h4>
                    <div className="mb-5">
                        <FormControl>
                            <TextField id="referee" name="referee" type="text" variant='outlined' placeholder='Add the referee name'
                            {...formik.getFieldProps('referee')} {...textErrorHelper(formik, 'referee')}
                            />
                        </FormControl>
                    </div>
                        <div className="mb-5">
                        <FormControl>
                            <TextField id="stadium" name="stadium" type="text" variant='outlined' placeholder='Add the stadium name'
                            {...formik.getFieldProps('stadium')} {...textErrorHelper(formik, 'stadium')}
                            />
                        </FormControl>
                    </div>
                    <div className="mb-5">
                               <FormControl error={selectIsError(formik, 'result')}>
                              <Select
                              id="result" name="result" variant="outlined" displayEmpty
                               {...formik.getFieldProps('result')}>
                                  <MenuItem disabled>Select Result</MenuItem>
                                  <MenuItem value="W" >Win</MenuItem>
                                  <MenuItem value="L" >Loss</MenuItem>
                                  <MenuItem value="D" >Draw</MenuItem>
                                  <MenuItem value="N/A" >N/A</MenuItem>
                              </Select>
                              {selectErrorHelper(formik, 'result')}
                          </FormControl>
                    </div>
                    <div className="mb-5">
                        <FormControl error={selectIsError(formik, 'final')}>
                              <Select
                              id="final" name="final" variant="outlined" displayEmpty
                               {...formik.getFieldProps('final')}>
                                  <MenuItem disabled>Game Was Played?</MenuItem>
                                  <MenuItem value="Yes" >Yes</MenuItem>
                                  <MenuItem value="No" >No</MenuItem>
                              </Select>
                              {selectErrorHelper(formik, 'final')}
                          </FormControl>
                    </div>

                    <Button variant='contained' type="submit" disabled={loading}>
                        {formType == 'add' ? "Add  Match" : "Edit Match" }
                    </Button>

                      </div>

                </form>
            </div>
        </div>
    </AdminLayout>
  )
}

export default AddEditMatch