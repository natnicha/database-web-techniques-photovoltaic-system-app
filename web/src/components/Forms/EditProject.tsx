import { MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import { useEffect, useState } from 'react';
import {useLocation, useNavigate}  from "react-router-dom";
import '../../global.css';
import { latLngBounds } from "leaflet";
import Cookies from "js-cookie";

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
  let south=180, west=180, north=0, east=0
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

function findSolarPanelById(masterSolarPanel: any, targetId: number){
  for (const solarPanel of masterSolarPanel) {
    if (solarPanel.id == targetId){
      return solarPanel
    }
  }
  return {}
}

export default function EditProject() {
  
  const navigate = useNavigate()
  const location = useLocation();
  const [jwt, setJwt] = useState('');
  const [products, setProducts] = useState([] as any);
  const [mapSetting, setMapSetting] = useState({south:0.0, west:0.0, north:0.0, east:0.0});
  let solarPanel = {}

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [startAt, setStartAt] = useState('');
  const [status, setStatus] = useState('');
  const [generatedEnergy, setGeneratedEnergy] = useState('');
  const [isPrinted, setIsPrinted] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (location.state === undefined || location.state == null ){
      navigate("/projectlist")
      return
    }
    
    let jwt = Cookies.get('jwt')?.toString()
    if ( typeof(jwt) == 'undefined' && jwt == null){
      navigate("/")
      return
    }
    setJwt(String(jwt))

    fetch(`http://localhost:8000/api/v1/solar-panel-model/`, {
      method: 'GET', 
      headers: {'Authorization': "bearer "+jwt},
      })  
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        if (response.status == 401) {
          Cookies.remove("jwt")
          navigate("/")
          return
        }
      }).then((data) => {
        if (data.data != null) {
          solarPanel = data.data
        } else {
          setFeedback(data["error"])
        }
      })
      .catch((error) => {
        console.log('error: ' + error);
      });

    const queryString = objToQueryString({
      "project_id": location.state.data[0].id,
    });

    fetch(`http://localhost:8000/api/v1/project/?filter=id:`+location.state.data[0].id, {
      method: 'GET', 
      headers: {'Authorization': "bearer "+jwt},
      })
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        if (response.status == 401) {
          Cookies.remove("jwt")
          navigate("/")
          return
        }
      }).then((data) => {
        if (data.data != null){
          const result = data.data.map((element: { id: any; user_id: any; name: any; description: any; start_at: any; is_printed: any; }) => (
            { 'id': element.id, 
            'user_id': element.user_id,
            'name': element.name,
            'description': element.description,
            'start_at': new Date(element.start_at).toLocaleString(
              "en-US",
                {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric" 
                }
            ) ,
            'is_printed': String(element.is_printed) === "true"? "Printed" : "Open",
            'generated_energy': 0
          }));
          setProjectName(result[0].name)
          setProjectDescription(result[0].description)
          setStartAt(result[0].start_at)
          setStatus(result[0].is_printed)
          setIsPrinted(data.data[0].is_printed)
        } else {
          setFeedback(data["error"])
        }
      })
      .catch((error) => {
        console.log('error: ' + error);
      });

    fetch(`http://localhost:8000/api/v1/product/`+queryString, {
      method: 'GET', 
      headers: {'Authorization': "bearer "+jwt},
      })  
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        if (response.status == 401) {
          Cookies.remove("jwt")
          navigate("/")
          return
        }
      }).then((data) => {
        if (data.data != null){
          const result = data.data.map((element: { id: number; project_id: number; solar_panel_model_id: number; orientation: number; inclination: number; area: number; geolocation: string; generated_energy: number }) => (
            { 
              'id': element.id,
              'project_id': element.project_id,
              'solar_panel_model_id': element.solar_panel_model_id,
              'solar_panel_model': findSolarPanelById(solarPanel, element.solar_panel_model_id).name,
              'description': findSolarPanelById(solarPanel, element.solar_panel_model_id).description,
              'efficiency': findSolarPanelById(solarPanel, element.solar_panel_model_id).efficiency,
              'orientation': element.orientation,
              'inclination': element.inclination,
              'area': element.area,
              'geolocation': element.geolocation.substring(1, element.geolocation.length-1),
              'generated_energy': element.generated_energy,
          }));
          let location = calculateBound(result)
          setMapSetting(location)
          setProducts(result)
          
          var total = 0
          for (const solarPanel of result) {
            total += solarPanel.generated_energy
          }
          setGeneratedEnergy(parseFloat(total.toString()).toFixed(2))
        } else {
          setFeedback(data["error"])
        }
      })  
      .catch((error) => {
        console.log('error: ' + error);
      });
  }, []);
  
  const handleDelete = (event: { preventDefault: () => void;}) => {
    event.preventDefault()
    fetch(`http://localhost:8000/api/v1/project/delete/`+location.state.data[0].id, {
      method: 'DELETE', 
      headers: {'Authorization': "bearer "+jwt},
      })  
      .then((response) => {
        if (response.ok) {
          navigate("/projectlist")
          console.log("delete successfully!")
          return response.json()
        }
        if (response.status == 401) {
          Cookies.remove("jwt")
          navigate("/")
          return
        }
      }) 
      .catch((error) => {
        console.log('error: ' + error);
      });

  };

  const handleBackLink = () => {
    navigate("/projectlist")
    return
  };

  const handleEditProject = () => {
    navigate("/editprojectdetail", {state:{project_id:location.state.data[0].id}})
    return
  };
  
  const handleExportReport =  (event: { preventDefault: () => void;}) => {
    event.preventDefault();
    fetch(`http://localhost:8000/api/v1/solar-panel-model/`, {
      method: 'GET', 
      headers: {'Authorization': "bearer "+jwt},
      })
      .then((response) => {
        if (response.ok) {
            return response.json()
        }
        if (response.status == 401) {
          Cookies.remove("jwt")
          navigate("/")
          return
        }
      }).then((data) => {
        solarPanel = data.data
      })
      .catch((error) => {
        console.log('error: ' + error);
      });

    fetch(`http://localhost:8000/api/v1/project/generate-report/`+location.state.data[0].id, {
      method: 'POST', 
      headers: {'Authorization': "bearer "+jwt},
      })
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        if (response.status == 401) {
          Cookies.remove("jwt")
          navigate("/")
          return
        }
      }) 
      .catch((error) => {
        console.log('error: ' + error);
      });
      
    fetch(`http://localhost:8000/api/v1/project/?filter=id:`+location.state.data[0].id, {
      method: 'GET', 
      headers: {'Authorization': "bearer "+jwt},
      })
      .then((response) => {
        if (response.ok) {
            return response.json()
        }
        if (response.status == 401) {
          Cookies.remove("jwt")
          navigate("/")
          return
        }
      }).then((data) => {
        if (data.data != null){
          const result = data.data.map((element: { id: any; user_id: any; name: any; description: any; start_at: any; is_printed: any; }) => (
            { 'id': element.id, 
            'user_id': element.user_id,
            'name': element.name,
            'description': element.description,
            'start_at': new Date(element.start_at).toLocaleString(
              "en-US",
                {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric" 
                }
            ) ,
            'is_printed': String(element.is_printed) === "true"? "Printed" : "Open",
            'generated_energy': 0
          }));
          setProjectName(result[0].name)
          setProjectDescription(result[0].description)
          setStartAt(result[0].start_at)
          setStatus(result[0].is_printed)
          setIsPrinted(data.data[0].is_printed)
        }
      })
      .catch((error) => {
        console.log('error: ' + error);
      });

      fetch(`http://localhost:8000/api/v1/product/?filter=project_id:`+location.state.data[0].id, {
        method: 'GET', 
        headers: {'Authorization': "bearer "+jwt},
        })
        .then((response) => {
          if (response.ok) {
              return response.json()
          }
          if (response.status == 401) {
            Cookies.remove("jwt")
            navigate("/")
            return
          }
        }).then((data) => {
          if (data.data != null){
            const result = data.data.map((element: { id: number; project_id: number; solar_panel_model_id: number; orientation: number; inclination: number; area: number; geolocation: string; generated_energy: number }) => (
              { 
                'id': element.id,
                'project_id': element.project_id,
                'solar_panel_model_id': element.solar_panel_model_id,
                'solar_panel_model': findSolarPanelById(solarPanel, element.solar_panel_model_id).name,
                'description': findSolarPanelById(solarPanel, element.solar_panel_model_id).description,
                'efficiency': findSolarPanelById(solarPanel, element.solar_panel_model_id).efficiency,
                'orientation': element.orientation,
                'inclination': element.inclination,
                'area': element.area,
                'geolocation': element.geolocation.substring(1, element.geolocation.length-1),
                'generated_energy': element.generated_energy,
            }));
            
            var total = 0
            for (const solarPanel of result) {
              total += solarPanel.generated_energy
            }
            setGeneratedEnergy(parseFloat(total.toString()).toFixed(2))
            setProducts(result)
            setFeedback("Report(s) will be sent to you email and update information on this page soon.")
          }
        })
        .catch((error) => {
          console.log('error: ' + error);
        });
  };

  const handleAddNewProduct =  (event: { preventDefault: () => void;}) => {
    event.preventDefault();
    navigate("/newproduct",{state:{project:location.state.data}})
    return
  };

  const handleRowClick = (id: number) => {
    if (!isPrinted) {
      let targetProduct
      for (const product of products) {
        if (id == product.id) {
          targetProduct = product
          break;
        }
      }
      navigate("/editproduct",{state:{product:targetProduct, project:location.state.data}})
      return
    }
  };

  return (
    <div className="wrap-projectlist">
      <table>
        <tbody>
          <tr className="noHover">
            <td><label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="projectName">
              Name</label></td>
            <td><label className="block mb-2 p-l-100 text-sm text-gray-700">
              {projectName}</label></td>
          </tr>

          <tr className="noHover">
            <td><label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="projectDescription">
              Description</label></td>
            <td><label className="block mb-2 p-l-100 text-sm text-gray-700">
              {projectDescription}</label></td>
          </tr>

          <tr className="noHover">
            <td><label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="startAt">
              Start At (local time)</label></td>
            <td><label className="block mb-2 p-l-100 text-sm text-gray-700">
              {startAt}</label></td>
          </tr>
            
          <tr className="noHover">
            <td><label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="status">
              Status</label></td>
            <td><label className="block mb-2 p-l-100 text-sm text-gray-700">
              {status}</label></td>
          </tr>
          
          <tr className="noHover">
            <td><label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="generatedEnergy">
              Generated Energy (kWh)</label></td>
            <td><label className="block mb-2 p-l-100 text-sm text-gray-700">
              {generatedEnergy}</label></td>
          </tr>
        </tbody>
      </table>

      <form>
        <div>
          <label className="feedback">
            {feedback}</label>
        </div>
          <button className="my-button p-l-10 rounded-full bg-[#3D5FD9] text-[#F5F7FF] w-[25rem] p-3 mt-5 hover:bg-[#2347C5] mb-5" 
            onClick={handleEditProject}
            disabled={isPrinted || products.length>0}>
            Edit Project
          </button>

          <button className="my-button p-l-10 rounded-full bg-[#3D5FD9] text-[#F5F7FF] w-[24rem] p-3 mt-5 hover:bg-[#2347C5] mb-5" 
            onClick={(event) => handleExportReport(event)}
            disabled={isPrinted || products.length==0}>
            Export Report
          </button>
        {products.length > 0 && (
          <table className="wrapper 2" >
            <tbody>
              <tr className="noHover">
                <th className="box">Name</th>
                <th className="box">Description</th>
                <th className="box">Efficiency (%)</th>
                <th className="box">Orientation (°)</th>
                <th className="box">Inclination (°)</th>
                <th className="box">Area (sq.m.)</th>
                <th className="box">Location</th>
                <th className="box">Generated Energy (kWh)</th>
              </tr>
              {products.map((item: { id: number; solar_panel_model: string, description: string, efficiency: number, orientation: number; inclination: number; area: number; geolocation: string; generated_energy: number}) =>
                <tr key={item.id} onClick={() => handleRowClick(item.id)} > 
                  <td className="box">{item.solar_panel_model}</td>
                  <td className="box">{item.description}</td>
                  <td className="box-number">{item.efficiency}</td>
                  <td className="box-number">{item.orientation}</td>
                  <td className="box-number">{item.inclination}</td>
                  <td className="box-number">{item.area}</td>
                  <td className="box-number">{item.geolocation}</td>
                  <td className="box-number">{item.generated_energy}</td>
                </tr> 
              )}
            </tbody>
          </table>
        )}
        <div>
          <button className="my-button rounded-full bg-[#3D5FD9] text-[#F5F7FF] w-[25rem] p-3 mt-5 hover:bg-[#2347C5] mb-5" 
            onClick={(event) => handleAddNewProduct(event)}
            disabled={isPrinted}>
              Add new product
          </button>
        </div>
          <div className="map">
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
            integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" ></script>
            
          {mapSetting.south != 0 && (
            <MapContainer
              className="markercluster-map"
              bounds={latLngBounds([mapSetting.south, mapSetting.west],[mapSetting.north, mapSetting.east])}
              zoom={3}
              maxZoom={18}
              >
              <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {products.length > 0 && (
                <ul>
                  {products.map((item: { id: number; solar_panel_model: string; orientation: number; inclination: number; area: number; geolocation: string; }) =>
                    <Marker key={item.id}  position={[Number(item.geolocation.split(",")[0]), Number(item.geolocation.split(",")[1])]}>
                      <Popup>
                        <b>model: </b> {item.solar_panel_model} <br/>
                        <b>location:</b> {item.geolocation} <br/>
                        <b>orientation:</b> {item.orientation}°<br/>
                        <b>inclination:</b> {item.inclination}°<br/>
                        <b>area:</b> {item.area} sq.m.<br/>
                      </Popup>
                      </Marker>
                  )}
                </ul>
              )}
            </MapContainer>
          )}
          </div>
        <div>
          <button className="my-button rounded-full bg-[#c80000] text-[#F5F7FF] w-[25rem] p-3 mt-5 hover:bg-[#af0000] mb-5" 
          onClick={(event) => handleDelete(event)}
          disabled={isPrinted}>
            Delete Project
            </button>
        </div>
        <div>
          <label onClick={handleBackLink} className="txt2 mb-5">
            Back
          </label>
        </div>
      </form>
    </div>
  );
}