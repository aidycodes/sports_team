import React from 'react';
import Featured from './featured';
import MatchesMain from './matches';
import MeetPlayers from './meetPlayers';
import Promotion from './Promotion';

const Home = () => {
  return (
    <>
    <div className='bck_blue'>
      <Featured/>
      <MatchesMain/>
      <MeetPlayers/>
      <Promotion/>
    </div>
    </>
  )
}

export default Home