import { MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
// import MarkerClusterGroup from "react-leaflet-markercluster";
import React, { useEffect, useState } from 'react';
import {useLocation}  from "react-router-dom";
import '../../global.css';
import { bounds, latLngBounds, map } from "leaflet";

function objToQueryString(obj: { [x: string]: string | number | boolean; }) {
  const keyValuePairs = [];
  for (const key in obj) {
    if (obj[key] != "") {
      keyValuePairs.push(encodeURIComponent(key) + ':' + encodeURIComponent(obj[key]));
    }
  }
  return "?filter="+ keyValuePairs.join('&');
}


function calculateBound(products: any){
  let south=100, west=100, north=0, east=0
  for (const product of products) {
    let location = (product.geolocation.split(","))
    if (Number(location[0]) < south) {
      south = Number(location[0])
    }
    if (Number(location[1]) < west) {
      west = Number(location[1])
    }

    if (Number(location[0]) > north) {
      north = Number(location[0])
    }
    if (Number(location[1]) > east) {
      east = Number(location[1])
    }
  }
  return {south, west, north, east}
}
export default function Map() {
  
  const location = useLocation();
  const [projectDetail, setProjectDetail] = useState([] as any);
  const [products, setProducts] = useState([] as any);
  const [mapSetting, setMapSetting] = useState({south:0.0, west:0.0, north:0.0, east:0.0});
  

  useEffect(() => {
    const queryString = objToQueryString({
      "project_id": location.state.data[0].id,
    });
    setProjectDetail(location.state.data)
    fetch(`http://localhost:8000/api/v1/product/`+queryString, {
        method: 'GET', 
        headers: {'Authorization': "bearer "+location.state.access_token},
        })  
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
          }).then((data) => {
            const result = data.data.map((element: { id: number; project_id: number; solar_panel_model_id: number; orientation: number; inclination: number; area: number; geolocation: string; }) => (
              { 
                'id': element.id,
                'project_id': element.project_id,
                'solar_panel_model_id': element.solar_panel_model_id,
                'orientation': element.orientation,
                'inclination': element.inclination,
                'area': element.area,
                'geolocation': element.geolocation.substring(1, element.geolocation.length-1),
            }));
            let location = calculateBound(result)
            setMapSetting(location)
            setProducts(result)
          })  
          .catch((error) => {
            console.log('error: ' + error);
          });
  }, []);
  
  return (
    <div>
      <div>
        {projectDetail.length > 0 && (
          <table className="wrapper 1" >
            <ul>
              <tr> 
                  <th className="box a">Name</th>
                  <th className="box b">Description</th>
                  <th className="box c">Date</th>
                  <th className="box d">Status</th>
              </tr>
              {projectDetail.map((item: { id: number; name: string; description: string; start_at: string; is_printed: string; }) =>
                <tr key={item.id} > 
                  <td className="box a">{item.name}</td>
                  <td className="box b">{item.description}</td>
                  <td className="box c">{item.start_at}</td>
                  <td className="box d">{item.is_printed}</td>
                </tr> 
              )}
            </ul>
          </table>
        )}
      </div>
      <div>
        {products.length > 0 && (
          <table className="wrapper 2" >
            <ul>
              <tr> 
                  <th className="box a">Orientation</th>
                  <th className="box b">Inclination</th>
                  <th className="box c">Area</th>
                  <th className="box d">Geolocation</th>
              </tr>
              {products.map((item: { id: number; orientation: number; inclination: number; area: number; geolocation: string; }) =>
                <tr key={item.id} > 
                  <td className="box a">{item.orientation}</td>
                  <td className="box b">{item.inclination}</td>
                  <td className="box c">{item.area}</td>
                  <td className="box d">{item.geolocation}</td>
                </tr> 
              )}
            </ul>
          </table>
        )}
      </div>
      {mapSetting.south != 0 && (
        <ul>
          <div className="map">
              <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
              <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
              integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" ></script>
              
              <MapContainer
                  className="markercluster-map"
                  bounds={latLngBounds([mapSetting.south, mapSetting.west],[mapSetting.north, mapSetting.east])}
                  zoom={3}
                  maxZoom={6}
                  >
                  <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {products.length > 0 && (
                    <ul>
                      {products.map((item: { id: number; orientation: number; inclination: number; area: number; geolocation: string; }) =>
                        
                        <Marker position={[Number(item.geolocation.split(",")[0]), Number(item.geolocation.split(",")[1])]}>
                              <Popup>
                                  location: {item.geolocation} <br/>
                                  orientation: {item.orientation}°<br/>
                                  inclination: {item.inclination}°<br/>
                                  area: {item.area} sq.m.<br/>
                              </Popup>
                          </Marker>
                      )}
                    </ul>
                  )}
              </MapContainer>
          </div>
        </ul>
      )}
    </div>
  );
}