import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import {useLocation, useNavigate}  from "react-router-dom";

const editProduct = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const [jwt, setJwt] = useState('');
  const [latitude, setLatitude] = useState('' as any);
  const [longitude, setLongitude] = useState('' as any);
  const [area, setArea] = useState('' as any);
  const [orientation, setOrientation] = useState('' as any);
  const [inclination, setInclination] = useState('' as any);
  const [solarPanelId, setSolarPanelId] = useState('' as any);
  const [solarPanels, setSolarPanels] = useState([] as any);

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

    setLatitude(location.state.product.geolocation.split(",")[0])
    setLongitude(location.state.product.geolocation.split(",")[1])
    setArea(location.state.product.area)
    setOrientation(location.state.product.orientation)
    setInclination(location.state.product.inclination)
    setSolarPanelId(location.state.product.solar_panel_model_id)
    
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
        if (data.data ){
          setSolarPanels(data.data)
        }
      })
      .catch((error) => {
        console.log('error: ' + error);
      });
  }, [])

  
  const handleLatitudeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setLatitude(Number(event.target.value));
  };
  
  const handleLongitudeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setLongitude(Number(event.target.value));
  };
  
  const handleAreaChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setArea(Number(event.target.value));
  };
  
  const handleOrientationChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setOrientation(Number(event.target.value));
  };
  
  const handleInclinationChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setInclination(Number(event.target.value));
  };

  const handleSolarPanelChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSolarPanelId(Number(event.target.value))
  };

  const handleSaveButton = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    
    let data = {
      'project_id': location.state.project[0].id,
      'solar_panel_model_id': solarPanelId,
      'orientation': orientation,
      'inclination': inclination,
      'area': area,
      'geolocation': latitude+","+longitude,
    }
    fetch(`http://localhost:8000/api/v1/product/update/`+location.state.product.id, {
      method: 'PUT', 
      headers: {'Authorization': "bearer "+jwt},
      body: JSON.stringify(data)
      })
      .then((response) => {
        console.log(response)
        if (response.ok) {
          handleBackLink()
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

  const handleDeleteButton = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    fetch(`http://localhost:8000/api/v1/product/delete/`+location.state.product.id, {
      method: 'DELETE', 
      headers: {'Authorization': "bearer "+jwt},
      })  
      .then((response) => {
        if (response.ok) {
          handleBackLink()
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
    navigate("/editproject",{state:{data:location.state.project, project_id:location.state.project[0].id}})
    return
  };

  return (
    <div className='wrap-login100'>
      <form>
        <div>
          <span className="login100-form-title p-b-49">
            Update Product
          </span>
          <div>
          <label className='block mb-2 text-sm font-bold text-gray-700'>Latitude</label>
          <input className='w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500'
            type="number"
            value={latitude}
            onChange={handleLatitudeChange}
          />
          
          </div>
          
          <div>
            <label className='block mb-2 text-sm font-bold text-gray-700'>Longitude</label>
            <input className='w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500'
              type="number"
              value={longitude}
              onChange={handleLongitudeChange}
            ></input>
          </div>
          
          <div>
            <label className='block mb-2 text-sm font-bold text-gray-700'>Solar Panel</label>
            <select  className='w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500'
            value={solarPanelId} onChange={(event) => handleSolarPanelChange(event)}>
              {solarPanels.map((solarPanel: { id:number, name: string; efficiency:number }, index: React.Key) => (
                <option key={index} value={solarPanel.id}  >
                  {solarPanel.name+" ("+solarPanel.efficiency+"%)"}
                </option>
              ))}
              </select>
          </div>

          <div>
            <label className='block mb-2 text-sm font-bold text-gray-700'>Area</label>
            <input className='w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500'
              type="number"
              value={area}
              onChange={handleAreaChange}
            ></input>
          </div>
          
          <div>
            <label className='block mb-2 text-sm font-bold text-gray-700'>Orientation</label>
            <input className='w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500'
              type="number"
              value={orientation}
              onChange={handleOrientationChange}
            ></input>
          </div>
          
          <div>
            <label className='block mb-2 text-sm font-bold text-gray-700'>Inclination</label>
            <input className='w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500'
              type="number"
              value={inclination}
              onChange={handleInclinationChange}
            ></input>
          </div>
          
        </div>
        <div className="flex-col-c p-t-10">
        <button
            className={`rounded-full bg-[#3D5FD9] text-[#F5F7FF] w-[25rem] p-3 mt-5 hover:bg-[#2347C5] mb-5`}
            onClick={(event) => handleSaveButton(event)}
          >Save
        </button>
        <button
            className={`rounded-full bg-[#c80000] text-[#F5F7FF] w-[25rem] p-3 hover:bg-[#af0000] mb-5`}
            onClick={(event) => handleDeleteButton(event)}
          >Delete
        </button>
						<label onClick={handleBackLink} className="txt2">
							Back
						</label>
				</div>
      </form>
    </div>
  );
};

export default editProduct;