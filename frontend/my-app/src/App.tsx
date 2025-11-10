import { useState } from 'react'
import './App.css'
import { MapWindow } from './Components/mapWindow';

function App() {


  //The h1 should be replaced with a proper header component later
  return (
    <>
      <h1>Participium Map</h1>
      <div className="appContainer">
        <MapWindow />
      </div>
    </>
  )
}

export default App
