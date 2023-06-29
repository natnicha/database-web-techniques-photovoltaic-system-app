import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import {useLocation, useNavigate}  from "react-router-dom";

const editProduct = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const [jwt, setJwt] = useState('');
  const [latitude, setLatitude] = useState("" as any);
  const [longitude, setLongitude] = useState("" as any);
  const [area, setArea] = useState("" as any);
  const [orientation, setOrientation] = useState("" as any);
  const [inclination, setInclination] = useState("" as any);
  const [solarPanelId, setSolarPanelId] = useState("" as any);
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

    setSolarPanelId(1)
    
    fetch(`http://localhost:8000/api/v1/solar-panel-model/`, {
      method: 'GET', 
      headers: {'Authorization': "bearer "+jwt},
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
    fetch(`http://localhost:8000/api/v1/product/create`, {
      method: 'POST', 
      headers: {'Authorization': "bearer "+jwt},
      body: JSON.stringify(data)
      })
      .then((response) => {
        console.log(response)
        if (response.ok) {
          handleBackLink()
          return response.json()
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
            New Product
          </span>
          <div>
          <label>Latitude:</label>
          <input
            className='input100 block peer rounded-[5px] w-[25rem] mt-5 border-[#C93B32] focus:outline-none focus:border-[#C93B32]  focus:ring-1 focus:ring-[#C93B32]" : "block peer rounded-[5px] mt-5 border-[#AEBBCD] w-[25rem] focus:outline-none focus:ring-1' 
            type="number"
            value={latitude}
            placeholder='latitude'
            onChange={handleLatitudeChange}
          />
          </div>
          
          <div>
            <label>Longitude:</label>
            <input
              className='input100 block peer rounded-[5px] w-[25rem] mt-5 border-[#C93B32] focus:outline-none focus:border-[#C93B32]  focus:ring-1 focus:ring-[#C93B32]" : "block peer rounded-[5px] mt-5 border-[#AEBBCD] w-[25rem] focus:outline-none focus:ring-1' 
              type="number"
              value={longitude}
              placeholder='longitude'
              onChange={handleLongitudeChange}
            ></input>
          </div>
          
          <div>
            <label>Solar Panel:</label>
            <select className='block peer rounded-[5px] w-[25rem] mt-5 border-[#C93B32] focus:outline-none focus:border-[#C93B32]  focus:ring-1 focus:ring-[#C93B32]" : "block peer rounded-[5px] mt-5 border-[#AEBBCD] w-[25rem] focus:outline-none focus:ring-1' 
            value={solarPanelId} onChange={(event) => handleSolarPanelChange(event)}>
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
              className='input100 block peer rounded-[5px] w-[25rem] mt-5 border-[#C93B32] focus:outline-none focus:border-[#C93B32]  focus:ring-1 focus:ring-[#C93B32]" : "input100 block peer rounded-[5px] mt-5 border-[#AEBBCD] w-[25rem] focus:outline-none focus:ring-1' 
              type="number"
              value={area}
              placeholder='area'
              onChange={handleAreaChange}
            ></input>
          </div>
          
          <div>
            <label>Orientation:</label>
            <input
              className='input100 block peer rounded-[5px] w-[25rem] mt-5 border-[#C93B32] focus:outline-none focus:border-[#C93B32]  focus:ring-1 focus:ring-[#C93B32]" : "input100 block peer rounded-[5px] mt-5 border-[#AEBBCD] w-[25rem] focus:outline-none focus:ring-1' 
              type="number"
              value={orientation}
              placeholder='orientation'
              onChange={handleOrientationChange}
            ></input>
          </div>
          
          <div>
            <label>Inclination:</label>
            <input
              className='input100 block peer rounded-[5px] w-[25rem] mt-5 border-[#C93B32] focus:outline-none focus:border-[#C93B32]  focus:ring-1 focus:ring-[#C93B32]" : "input100 block peer rounded-[5px] mt-5 border-[#AEBBCD] w-[25rem] focus:outline-none focus:ring-1' 
              type="number"
              value={inclination}
              placeholder='inclination'
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
        <label onClick={handleBackLink} className="txt2 mb-5">
          Back
        </label>
				</div>
      </form>
    </div>
  );
};

export default editProduct;