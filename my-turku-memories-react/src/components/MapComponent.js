//https://blog.logrocket.com/how-to-use-react-leaflet/
//https://www.azavea.com/blog/2016/12/05/getting-started-with-react-and-leaflet/
//https://cherniavskii.com/using-leaflet-in-react-apps/
import React, { Component } from 'react'
//import { Map, TileLayer } from 'react-leaflet'
import L from 'leaflet'

export class MapComponent extends Component {
  componentDidMount() {
    this.map = L.map('map', {
      center: [60.45, 22.26],
      zoom: 16,
      accessToken: "pk.eyJ1IjoibXl0dXJrdW1lbW9yaWVzIiwiYSI6ImNrNXhuZjdjMjBramMzbm54YWNjZWsweDQifQ.VSBHa6HkpaJfywOHhEjgbA", // Not being used
      layers: [
        L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXl0dXJrdW1lbW9yaWVzIiwiYSI6ImNrNXhuZjdjMjBramMzbm54YWNjZWsweDQifQ.VSBHa6HkpaJfywOHhEjgbA', {
          attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }),
      ]
    }).on('click', function(ev) {
      console.log(ev.latlng); // Get coordinates for markers example
    })
  }
  render() {
    return (
      <div id='map'></div>
    )
  }
}
