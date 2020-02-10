import React from 'react'
//import logo from './logo.svg'
import './App.css'
import 'semantic-ui-css/semantic.min.css'
import { MenuBars } from './components/Menus/MenuBars'
import { MapContainer } from './components/MapZone/MapContainer'

function App() {
  return (
    <div className="App">
      <header>
        <MenuBars />
        <MapContainer />
      </header>
    </div>
  )
}

export default App
