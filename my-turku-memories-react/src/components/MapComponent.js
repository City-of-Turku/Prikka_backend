//https://blog.logrocket.com/how-to-use-react-leaflet/
//https://www.azavea.com/blog/2016/12/05/getting-started-with-react-and-leaflet/
import React, { Component } from 'react'
import { Map, TileLayer } from 'react-leaflet'

export class MapComponent extends Component {
  state = {
    center: [60.45, 22.26],
  }
  render() {
    return (
      <Map center={this.state.center} zoom={13.5} layers="">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      </Map>
    )
  }
}
