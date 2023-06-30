import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import moment from 'moment-timezone';
import Cookies from 'js-cookie';

const NewProject = () => {
  const navigate = useNavigate()
  const [jwt, setJwt] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [startAt, setStartAt] = useState('');
  const [time, setTime] = useState('');
  const [timezones, setTimezones] = useState([] as any);
  const [selectedTimezones, setSelectedTimezones] = useState('' as any);
  
  const [selectedTimezoneOffset, setSelectedTimezoneOffset] = useState('');
  const [isCreatedProject, setIsCreatedProject] = useState(false);
  const [productId, setProductId] = useState(0);
  const [solarPanels, setSolarPanels] = useState([] as any);
  const [projectFeedback, setProjectFeedback] = useState([] as any);
  const [feedback, setFeedback] = useState([] as any);

  useEffect(() => {
    let jwt = Cookies.get('jwt')?.toString()
    if ( typeof(jwt) == 'undefined' && jwt == null){
      navigate("/")
      return
    }
    setJwt(String(jwt))

    let tempDate = new Date();
    let date = tempDate.getFullYear() + '-' + ("0" + (tempDate.getMonth() + 1)).slice(-2) + '-' + tempDate.getDate(); 
    let time = ("0" + (tempDate.getHours())).slice(-2)  +':'+  ("0" + (tempDate.getMinutes())).slice(-2) +':'+  ("0" + (tempDate.getSeconds())).slice(-2)
    setStartAt(date)
    setTime(time)


    const availableTimezones = moment.tz.names();
    const timezonesWithOffset = availableTimezones.map((tz) => ({
      name: tz,
      offset: moment().tz(tz).format('Z'),
    }));
    setTimezones(timezonesWithOffset);

    
    const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
    let offset = moment().tz(timeZone).format('Z')
    setSelectedTimezoneOffset(offset);
    
    setSelectedTimezones(timeZone+","+offset);

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
        setSolarPanels(data.data)
      })
      .catch((error) => {
        console.log('error: ' + error);
      });
  }, []);

  const handleProjectNameChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setProjectName(event.target.value);
  };

  const handleProjectDescriptionChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setProjectDescription(event.target.value);
  };

  const handleStartAtChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setStartAt(event.target.value);
  };

  const handleTimeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setTime(event.target.value);
  };

  const handleTimezoneChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    let value = event.target.value.toString().split(",")
    let timezone = value[0]
    let offset = moment().tz(timezone).format('Z')
    setSelectedTimezones(event.target.value.toString());
    setSelectedTimezoneOffset(offset);
  };

  const handleCreateProject = (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    let data = {
      'name': projectName,
      'description': projectDescription,
      'start_at': startAt +"T"+ time + selectedTimezoneOffset,
      'is_printed': false,
    }
    fetch(`http://localhost:8000/api/v1/project/create`, {
      method: 'POST', 
      headers: {'Authorization': "bearer "+jwt},
      body: JSON.stringify(data)
      })
      .then((response) => {
        console.log(response)
        if (response.ok) {
          setIsCreatedProject(true)
            return response.json()
        }
        if (response.status == 401) {
          Cookies.remove("jwt")
          navigate("/")
          return
        }
      }).then((data) => {
        if (data.data != null) {
          setProductId(data.data.id)
        }
      })
      .catch((error) => {
        console.log('error: ' + error);
      });
  };

  const handleUpdateProjectButton = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    
    let data = {
      'name': projectName,
      'description': projectDescription,
      'start_at': startAt +"T"+ time + selectedTimezoneOffset,
      'is_printed': false,
    }
    fetch(`http://localhost:8000/api/v1/project/update/`+productId, {
      method: 'PUT', 
      headers: {'Authorization': "bearer "+jwt},
      body: JSON.stringify(data)
      })
      .then((response) => {
        console.log(response)
        if (response.ok) {
          setProjectFeedback("saved successfully")
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

  const handleAddRow = (event: { preventDefault: () => void; }) => {
    event.preventDefault()
    const newProductRow = {
      id:productRows.length, no:productRows.length+1, solarPanelId: 1, latitude:0, longitude:0, area:0, orientation:0, inclination:0, productId:0
    };
    setProductRows((prevRows: any) => [...prevRows, newProductRow]);
  };


  const [productRows, setProductRows] = useState([{
    id:0, no:1, solarPanelId: 1, latitude:0, longitude:0, area:0, orientation:0, inclination:0, productId:0
  }] as any);
  
  const handleProductChange = (event: { target: { value: React.SetStateAction<string>; }; }, rowId:number, columnName: string) => {
    const { value } = event.target;

    setProductRows((prevRows: any) => {
      const updatedRows = prevRows;
      updatedRows[rowId] = { ...updatedRows[rowId], [columnName]: Number(value) };
      return updatedRows;
    });
  };
  
  const handleSolarPanelChange = (event: { target: { value: React.SetStateAction<string>; }; }, rowId:number) => {
    const { value } = event.target;

    setProductRows((prevRows: any) => {
      const updatedRows = prevRows;
      updatedRows[rowId] = { ...updatedRows[rowId], solarPanelId: Number(value) };
      return updatedRows; 
    });
  };

  const handleSaveButton =  (event: { preventDefault: () => void;}, rowId: number) => {
    event.preventDefault()
    let target = productRows[rowId]
    
    let data = {
      'project_id': productId,
      'solar_panel_model_id': target.solarPanelId,
      'orientation': target.orientation,
      'inclination': target.inclination,
      'area': target.area,
      'geolocation': "(" + target.latitude + "," + target.longitude+")",
    }
    if (target.productId == 0){
      fetch(`http://localhost:8000/api/v1/product/create`, {
        method: 'POST', 
        headers: {'Authorization': "bearer "+jwt},
        body: JSON.stringify(data)
        })
        .then((response) => {
          return response.json()
        }).then((data) => {
          if (data.data != null) {
            setProductRows((prevRows: any) => {
              const updatedRows = prevRows;
              updatedRows[rowId] = { ...updatedRows[rowId], ["productId"]: data.data.id };
              return updatedRows;
            });
          } else {
            setFeedback(data['error'])
          }
        })
        .catch((error) => {
          console.log('error: ' + error);
        });
    } else {
      fetch(`http://localhost:8000/api/v1/product/update/`+target.productId, {
        method: 'PUT', 
        headers: {'Authorization': "bearer "+jwt},
        body: JSON.stringify(data)
        })
        .then((response) => {
          console.log(response)
          if (response.ok) {
            console.log('a product successfully saved!')
            return response.json()
          }
        })
        .catch((error) => {
          console.log('error: ' + error);
        });
    }
  };

  const handleBackLink = () => {
    navigate("/projectlist")
    return
  };

  return (
    <div className='wrap-newproject'>
      <span className="login100-form-title p-b-49">
        New Project
      </span>
          <label className='block mb-2 text-sm font-bold text-gray-700' 
              htmlFor="projectName">Name</label>
            <input className='w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500' 
              type="text"
              id="projectName"
              value={projectName}
              placeholder='project name'
              onChange={handleProjectNameChange}
            />

          <label className='block mb-2 text-sm font-bold text-gray-700' 
              htmlFor="projectDescription">Description</label>
            <input className='w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500' 
              type="text"
              id="projectDescription"
              placeholder='project description'
              value={projectDescription}
              onChange={handleProjectDescriptionChange}
            ></input>

          <div>
          <label className='block mb-2 text-sm font-bold text-gray-700' 
              htmlFor="startAt">Start At</label>
            <input className='w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500' 
              type="date"
              id="startAt"
              value={startAt}
              onChange={handleStartAtChange}
            />
          </div>

          <div>
            <label className='block mb-2 text-sm font-bold text-gray-700'>Time</label>
            <input className='w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500' 
              type="time"
              id="time"
              value={time}
              onChange={handleTimeChange}
            />
          </div>

          <div>
            <label className='block mb-2 text-sm font-bold text-gray-700'>Timezone</label>
            <select className='w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500' 
              value={selectedTimezones} onChange={handleTimezoneChange} multiple={false}>
              {timezones.map((timezone: { name: string; offset: any; }, index: React.Key) => (
                <option key={index} value={timezone.name+","+timezone.offset}  >
                  {`${timezone.name} (GMT${timezone.offset})`}
                </option>
              ))}
            </select>
          </div>
      
      <div>
        <label className="feedback">
          {projectFeedback}</label>
      </div>
      
      <button className='my-button rounded-full bg-[#3D5FD9] text-[#F5F7FF] w-[25rem] p-3 mt-5 hover:bg-[#2347C5] mb-5' 
      type="submit" onClick={handleCreateProject} disabled={isCreatedProject}>Create Project</button>
    
    {productId > 0 && (
      <button
          className={`p-l-10 rounded-full bg-[#3D5FD9] text-[#F5F7FF] w-[25rem] p-3 mt-5 hover:bg-[#2347C5] mb-5`}
          onClick={(event) => handleUpdateProjectButton(event)}
        >Save
      </button>
    )}
  <form onSubmit={handleCreateProject}>
    {isCreatedProject && (
    <div>
      <span className="login100-form-title p-b-49 p-t-50">
        Product
      </span>
      <table className=''>
        <thead>
          <tr className='fs-14 noHover'>
            <th>No</th>
            <th>latitude</th>
            <th>longitude</th>
            <th>Solar Panel</th>
            <th>area[sq.m.]</th>
            <th>orientatione[°]</th>
            <th>inclination[°]</th>
          </tr>
        </thead>
        <tbody>
          {productRows.map((row: { id: number; no: number; name:string; solarPanelId:number}) => (
            <tr key={row.id}>
              <td>{row.no}</td>
              <td><input  
                type="number"
                placeholder="lat"
                className="wrap-input100 fs-14"
                onChange={(event) => handleProductChange(event, row.id, "latitude")}
              /></td>
              <td><input
                type="number"
                placeholder="long"
                className="wrap-input100 fs-14"
                onChange={(event) => handleProductChange(event, row.id, "longitude")}
              /></td>
              <td> {/* value={row.solarPanelId} */}
                <select  onChange={(event) => handleSolarPanelChange(event, row.id)}>
                  {solarPanels.map((solarPanel: { id:number, name: string; efficiency:number }) => (
                    <option key={row.id} value={solarPanel.id}  >
                      {solarPanel.name+" ("+solarPanel.efficiency+"%)"}
                    </option>
                  ))}
                  </select>
              </td>
              <td><input
                type="number"
                placeholder="area"
                className="wrap-input100 fs-14"
                onChange={(event) => handleProductChange(event, row.id, "area")}
              /></td> 
              <td><input
                type="number"
                placeholder="(0,180)"
                className="wrap-input100 fs-14"
                onChange={(event) => handleProductChange(event, row.id, "orientation")}
              /></td>
              <td><input
                type="number"
                placeholder="(-90,90)"
                className="wrap-input100 fs-14"
                onChange={(event) => handleProductChange(event, row.id, "inclination")}
              /></td>
              <td><button
                className="my-button rounded-full bg-[#3D5FD9] text-[#F5F7FF] w-[5rem] p-1 mt-5 hover:bg-[#2347C5] mb-5"
                onClick={(event) => handleSaveButton(event, row.id)}
              >Save</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <label className="feedback">
          {feedback}</label>
      </div>
      <button className='my-button rounded-full bg-[#3D5FD9] text-[#F5F7FF] w-[25rem] p-3 mt-5 hover:bg-[#2347C5] mb-5'
      onClick={(event) => handleAddRow(event)}>Add Product</button>
    </div>
    )}
        <div>
          <label onClick= {handleBackLink} className="txt2 mb-5">
            Back
          </label>
        </div>
      </form>
    </div>
  );
};

export default NewProject;