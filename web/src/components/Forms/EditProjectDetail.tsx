import Cookies from 'js-cookie';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import {useLocation, useNavigate}  from "react-router-dom";

const editProjectDetail = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const [jwt, setJwt] = useState('');
  const [projectName, setProjectName] = useState('' as any);
  const [projectDescription, setProjectDescription] = useState('' as any);
  const [startAt, setStartAt] = useState('' as any);
  const [time, setTime] = useState('' as any);
  const [timezones, setTimezones] = useState([] as any);
  const [selectedTimezones, setSelectedTimezones] = useState('' as any);
  
  const [selectedTimezoneOffset, setSelectedTimezoneOffset] = useState('');
  const [feedback, setFeedback] = useState([] as any);
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

    const availableTimezones = moment.tz.names();
    const timezonesWithOffset = availableTimezones.map((tz) => ({
      name: tz,
      offset: moment().tz(tz).format('Z'),
    }));
    setTimezones(timezonesWithOffset);

    fetch(`http://localhost:8000/api/v1/project/?filter=id:`+location.state.project_id, {
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
            'start_at': element.start_at,
            'start_date': new Date(element.start_at).toLocaleString(
              "en-US",
                {
                  day: "numeric",
                  month: "2-digit",
                  year: "numeric",
                  timeZoneName: "longOffset",
                }
            ) ,
            'start_time': new Date(element.start_at).toLocaleString(
              "en-US",
                {
                  hour: "2-digit",
                  minute: "numeric",
                  second: "numeric",
                }
            ) ,
            'is_printed': String(element.is_printed) === "true"? "Printed" : "Open",
            'generated_energy': 0
          }));
          setProjectName(result[0].name)
          setProjectDescription(result[0].description)
          
          let tempDate = new Date(result[0].start_at);
          let date = tempDate.getFullYear() + '-' + ("0" + (tempDate.getMonth() + 1)).slice(-2) + '-' + tempDate.getDate(); 
          let time = ("0" + (tempDate.getHours())).slice(-2)  +':'+  ("0" + (tempDate.getMinutes())).slice(-2) +':'+  ("0" + (tempDate.getSeconds())).slice(-2)
          setStartAt(date)
          setTime(time)
          const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
          let offset = moment().tz(timeZone).format('Z')
          console.log(timeZone+","+String(result[0].start_date).substring(String(result[0].start_date).length-6))
          setSelectedTimezones(timeZone+","+String(result[0].start_date).substring(String(result[0].start_date).length-6));
        } else {
          setFeedback(data["error"])
        }
      })
      .catch((error) => {
        console.log('error: ' + error);
      });
  }, [])

  
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

  const handleSaveButton = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    
    let data = {
      'name': projectName,
      'description': projectDescription,
      'start_at': startAt +"T"+ time + selectedTimezoneOffset,
      'is_printed': false,
    }
    fetch(`http://localhost:8000/api/v1/project/update/`+location.state.project_id, {
      method: 'PUT', 
      headers: {'Authorization': "bearer "+jwt},
      body: JSON.stringify(data)
      })
      .then((response) => {
        console.log(response)
        if (response.ok) {
          setFeedback("saved successfully")
          return response.json()
        }
        if (response.status == 401) {
          Cookies.remove("jwt")
          navigate("/")
          return
        }
      }).then((data) =>{
        if (data['error']) {
          setFeedback(data['error'])
        }
      })
      .catch((error) => {
        console.log('error: ' + error);
      });
  };

  const handleDeleteButton = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    fetch(`http://localhost:8000/api/v1/project/delete/`+location.state.project_id, {
      method: 'DELETE', 
      headers: {'Authorization': "bearer "+jwt},
      })  
      .then((response) => {
        if (response.ok) {
          navigate("/projectlist")
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
    var project = {
        id: location.state.project_id
    }
    navigate("/editproject",{state:{data:[project], project_id:location.state.project_id}})
    return
  };

  return (
    <div className='wrap-login100'>
      <form>
        <div>
          <span className="login100-form-title p-b-49">
            Update Project
          </span>
          <div>
            <label className='block mb-2 text-sm font-bold text-gray-700'>Project Name</label>
            <input className="w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500"
              type="text"
              placeholder='project name'
              value={projectName}
              onChange={handleProjectNameChange}
            />
          </div>
          
          <div>
            <label className='block mb-2 text-sm font-bold text-gray-700'>Project Description</label>
            <input className="w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500"
              type="text"
              placeholder='project description'
              value={projectDescription}
              onChange={handleProjectDescriptionChange}
            ></input>
          </div>
          
          <div>
            <label className='block mb-2 text-sm font-bold text-gray-700'>Start At</label>
            <input className="w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500"
              type="date"
              value={startAt}
              onChange={handleStartAtChange} 
            ></input>
          </div>
          
          <div>
            <label className='block mb-2 text-sm font-bold text-gray-700'>Time</label>
            <input className="w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500"
              type="time"
              value={time}
              onChange={handleTimeChange}
            ></input>
          </div>
          
          <div>
            <label className='block mb-2 text-sm font-bold text-gray-700'>Timezone</label>
            <select className="w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500"
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
          {feedback}</label>
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

export default editProjectDetail;