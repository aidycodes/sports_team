import React from 'react'
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthGuard from './Components/HoC/Auth';

import Header from './Components/Header footer/Header';
import Footer from './Components/Header footer/Footer';
import Home from './Components/Home'
import SignIn  from './Components/Signin'

import Dashboard from  './Components/Admin/Dashboard'
import AdminPlayers from './Components/Admin/players';
import AddEditPlayers from './Components/Admin/players/addEditPlayers';
import TheTeam from './Components/TheTeam';
import AdminMatches from './Components/Admin/matches';
import AddEditMatch from './Components/Admin/matches/AddEditMatch'

import MatchDisplay from './Components/matchDisplay';

const AppRoutes = ( { user } ) => {
 

  const NewComp = AuthGuard(Dashboard)

  const AdminPlayersComp = AuthGuard(AdminPlayers)
  const AddEditComp = AuthGuard(AddEditPlayers)

  const AdminMatchesComp = AuthGuard(AdminMatches)
  const AddEditMatches = AuthGuard(AddEditMatch)

  return (
        <BrowserRouter>
        <Header user={user}/>
        <Routes >
          <Route path="/dashboard" extact element={<NewComp user={user} />}/>

          <Route path="/admin_players/add_player" extact element={<AddEditComp/>}/>
          <Route path="/admin_players/edit_player/:id" extact element={<AddEditComp/>}/>
           <Route path="/admin_players" exact element={<AdminPlayersComp/>}/>
          
          <Route path="/admin_matches/add_match" extact element={<AddEditMatches/>}/>
          <Route path="/admin_matches/edit_match/:id" extact element={<AddEditMatches/>}/>
           <Route path="/admin_matches" exact element={<AdminMatchesComp/>}/>
         
          <Route path="/the_team" extact element={<TheTeam />}/>
          <Route path="/match_display" extact element={<MatchDisplay />}/>
          <Route path="/sign_in" exact element={<SignIn user={user}/>}/>
         
          <Route path="/" exact element={<Home/>}/>
     
        </Routes >
        <ToastContainer  theme="colored"
/>
        <Footer/>
        </BrowserRouter>
  );
}

export default AppRoutes;
