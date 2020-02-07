import React from 'react'
//import logo from './logo.svg'
import './App.css'
import 'semantic-ui-css/semantic.min.css'
import { NavigationBar } from './components/NavigationBar'
import { FilterBar } from './components/FilterBar'
import { MapComponent } from './components/MapComponent'

function App() {
  return (
    <div className="App">
      <header>
        <NavigationBar />
        <FilterBar />
        <MapComponent />
      </header>
    </div>
  )
}

export default App
