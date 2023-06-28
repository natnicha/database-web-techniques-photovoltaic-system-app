import React, { useState, useEffect } from 'react';
import {Link, useLocation, useNavigate}  from "react-router-dom";

const editProduct = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [area, setArea] = useState('');
  const [orientation, setOrientation] = useState('');
  const [inclination, setInclination] = useState('');
  const [solarPanelId, setSolarPanelId] = useState('');
  const [solarPanels, setSolarPanels] = useState([] as any);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setLatitude(location.state.product.geolocation.split(",")[0])
    setLongitude(location.state.product.geolocation.split(",")[1])
    setArea(location.state.product.area)
    setOrientation(location.state.product.orientation)
    setInclination(location.state.product.inclination)
    setSolarPanelId(location.state.product.solar_panel_model_id)
    setFeedback("")
    
    fetch(`http://localhost:8000/api/v1/solar-panel-model/`, {
      method: 'GET', 
      headers: {'Authorization': "bearer "+location.state.access_token},
      })  
      .then((response) => {
        if (response.ok) {
            return response.json()
        }
      }).then((data) => {
        setSolarPanels(data.data)
      })
      .catch((error) => {
        console.log('error: ' + error);
      });
  }, [])

  
  const handleLongitudeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setLongitude(event.target.value);
  };
  
  const handleAreaChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setArea(event.target.value);
  };
  
  const handleOrientationChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setOrientation(event.target.value);
  };
  
  const handleInclinationChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setInclination(event.target.value);
  };
  
  const handleLatitudeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setLatitude(event.target.value);
  };

  const handleSolarPanelChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSolarPanelId(event.target.value)
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
      headers: {'Authorization': "bearer "+location.state.access_token},
      body: JSON.stringify(data)
      })
      .then((response) => {
        console.log(response)
        if (response.ok) {
          setFeedback('saved successfully!')
          return response.json()
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
      headers: {'Authorization': "bearer "+location.state.access_token},
      })  
      .then((response) => {
        if (response.ok) {
          setFeedback('deleted successfully!')
          handleBackLink
          console.log("")
          return response.json()
        }
      }) 
      .catch((error) => {
        console.log('error: ' + error);
      });
  };

  const handleBackLink = () => {
    navigate("/map",{state:{access_token:location.state.access_token, data:location.state.project, project_id:location.state.project[0].id}})
  };

  return (
    <div className='wrap-login100'>
      <form>
        <div>
          <span className="login100-form-title p-b-49">
            Update Product
          </span>
          <div>
          <label>Latitude:</label>
          <input
            type="text"
            value={latitude}
            onChange={handleLatitudeChange}
          />
          
          </div>
          
          <div>
            <label>Longitude:</label>
            <input
              type="text"
              value={longitude}
              onChange={handleLongitudeChange}
            ></input>
          </div>
          
          <div>
            <label>Solar Panel:</label>
            <select value={solarPanelId} onChange={(event) => handleSolarPanelChange(event)}>
              {solarPanels.map((solarPanel: { id:number, name: string; efficiency:number }, index: React.Key) => (
                <option key={index} value={solarPanel.id}  >
                  {solarPanel.name+" ("+solarPanel.efficiency+"%)"}
                </option>
              ))}
              </select>
          </div>

          <div>
            <label>Area:</label>
            <input
              type="text"
              value={area}
              onChange={handleAreaChange}
            ></input>
          </div>
          
          <div>
            <label>Orientation:</label>
            <input
              type="text"
              value={orientation}
              onChange={handleOrientationChange}
            ></input>
          </div>
          
          <div>
            <label>Inclination:</label>
            <input
              type="text"
              value={inclination}
              onChange={handleInclinationChange}
            ></input>
          </div>
          
        </div>
        <div>
          <label className='feedback'>
            {feedback}</label>
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