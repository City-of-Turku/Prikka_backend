import React, { Component } from 'react'
import { NavigationBar } from './NavigationBar'
import { FilterBar } from './FilterBar'

const menuStyle = {
  position: 'absolute',
  width: '100%',
  height: 'auto',
  top: 0,
  left: 0,
  zIndex: '2',
  backgroundColor: 'white',
}

export class MenuBars extends Component {
  render() {
    return (
      <div style={menuStyle}>
        <NavigationBar />
        <FilterBar />
      </div>
    )
  }
}
