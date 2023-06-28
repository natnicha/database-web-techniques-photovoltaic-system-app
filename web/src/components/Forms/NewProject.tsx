import React, { useMemo, useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import moment from 'moment-timezone';

const NewProject = () => {
  const location = useLocation();
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [startAt, setStartAt] = useState('');
  const [time, setTime] = useState('');
  const [timezones, setTimezones] = useState([] as any);
  const [selectedTimezones, setSelectedTimezones] = useState([] as any);
  
  const [selectedTimezoneOffset, setSelectedTimezoneOffset] = useState("");
  const [isCreatedProject, setIsCreatedProject] = useState(false);
  const [productId, setProductId] = useState(0);
  const [solarPanels, setSolarPanels] = useState([] as any);

  useEffect(() => {
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
    // setIsCreatedProject(true)

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
    setSelectedTimezones(value);
    setSelectedTimezoneOffset(offset);
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    let data = {
      'name': projectName,
      'description': projectDescription,
      'start_at': startAt +"T"+ time + selectedTimezoneOffset,
      'is_printed': false,
    }
    fetch(`http://localhost:8000/api/v1/project/create`, {
      method: 'POST', 
      headers: {'Authorization': "bearer "+location.state.access_token},
      body: JSON.stringify(data)
      })
      .then((response) => {
        console.log(response)
        if (response.ok) {
          console.log('successfully created!')
          setIsCreatedProject(true)
            return response.json()
        }
      }).then((data) => {
        setProductId(data.data.id)
      })
      .catch((error) => {
        console.log('error: ' + error);
      });
  };

  const handleAddRow = () => {
    const newProductRow = {
      id:productRows.length, no:productRows.length+1, solarPanelId: 1, latitude:0, longitude:0, area:0, orientation:0, inclination:0, productId:0
    };
    setProductRows((prevRows: any) => [...prevRows, newProductRow]);
  };


  const [productRows, setProductRows] = useState([] as any);
  
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

  const handleSaveButton = (rowId: number)=> {
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
        headers: {'Authorization': "bearer "+location.state.access_token},
        body: JSON.stringify(data)
        })
        .then((response) => {
          console.log(response)
          if (response.ok) {
            console.log('a product successfully saved!')
            return response.json()
          }
        }).then((data) => {
          if (data != null) {
            setProductRows((prevRows: any) => {
              const updatedRows = prevRows;
              updatedRows[rowId] = { ...updatedRows[rowId], ["productId"]: data.data.id };
              return updatedRows;
            });
            console.log(productRows)
          }
        })
        .catch((error) => {
          console.log('error: ' + error);
        });
    } else {
      fetch(`http://localhost:8000/api/v1/product/update/`+target.productId, {
        method: 'PUT', 
        headers: {'Authorization': "bearer "+location.state.access_token},
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

  return (
    <div className='wrap-newproject'>
    <form onSubmit={handleSubmit}>
      <span className="login100-form-title p-b-49">
        New Project
      </span>
      <div>
        <label htmlFor="projectName">Name:</label>
        <input
          type="text"
          id="projectName"
          value={projectName}
          onChange={handleProjectNameChange}
        />
      </div>

      <div>
        <label htmlFor="projectDescription">Description:</label>
        <textarea
          id="projectDescription"
          value={projectDescription}
          onChange={handleProjectDescriptionChange}
        ></textarea>
      </div>

      <div>
        <label htmlFor="startAt">Start At:</label>
        <input
          type="date"
          id="startAt"
          value={startAt}
          onChange={handleStartAtChange}
        />
        <input
          type="time"
          id="time"
          value={time}
          onChange={handleTimeChange}
        />
        </div>

      <div>
        <label>Select a timezone:</label>
        <select value={selectedTimezones} onChange={handleTimezoneChange}>
          {timezones.map((timezone: { name: string; offset: any; }, index: React.Key | null | undefined) => (
            <option key={index} value={timezone.name+","+timezone.offset}  >
              {`${timezone.name} (GMT${timezone.offset})`}
            </option>
          ))}
        </select>
      </div>

      <button className='my-button' type="submit" onClick={handleSubmit} disabled={isCreatedProject}>Create Project</button>
    
    </form>
    
    {isCreatedProject && (
    <div>
      <span className="p-b-49">
        Product
      </span>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>latitude</th>
            <th>latitude</th>
            <th>Solar Panel</th>
            <th>area[sq.m.]</th>
            <th>orientation/tile[°]</th>
            <th>inclination/azimuth[°]</th>
          </tr>
        </thead>
        <tbody>
          {productRows.map((row: { id: number; no: number; name:string; solarPanelId:number}) => (
            <tr key={row.id}>
              <td>{row.no}</td>
              <td><input
                type="number"
                placeholder="latitude"
                className="wrap-input100"
                onChange={(event) => handleProductChange(event, row.id, "latitude")}
              /></td>
              <td><input
                type="number"
                placeholder="longitude"
                className="wrap-input100"
                onChange={(event) => handleProductChange(event, row.id, "longitude")}
              /></td>
              <td> {/* value={row.solarPanelId} */}
                <select  onChange={(event) => handleSolarPanelChange(event, row.id)}>
                  {solarPanels.map((solarPanel: { id:number, name: string; efficiency:number }, index: React.Key) => (
                    <option key={index} value={solarPanel.id}  >
                      {solarPanel.name+" ("+solarPanel.efficiency+"%)"}
                    </option>
                  ))}
                  </select>
              </td>
              <td><input
                type="number"
                placeholder="area"
                className="wrap-input100"
                onChange={(event) => handleProductChange(event, row.id, "area")}
              /></td> 
              <td><input
                type="number"
                placeholder="(0,180)"
                className="wrap-input100"
                onChange={(event) => handleProductChange(event, row.id, "orientation")}
              /></td>
              <td><input
                type="number"
                placeholder="(-90,90)"
                className="wrap-input100"
                onChange={(event) => handleProductChange(event, row.id, "inclination")}
              /></td>
              <td><button
                className="wrap-input100"
                onClick={() => handleSaveButton(row.id)}
              >Save</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleAddRow}>Add Row</button>
    </div>
    )}
    </div>
  );
};

export default NewProject;