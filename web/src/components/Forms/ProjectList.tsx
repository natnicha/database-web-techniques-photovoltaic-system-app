import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

function objToQueryString(obj: { [x: string]: string | number | boolean; }) {
  const keyValuePairs = [];
  for (const key in obj) {
    if (obj[key] != "") {
      keyValuePairs.push(encodeURIComponent(key) + ':' + encodeURIComponent(obj[key]));
    }
  }
  return "?filter="+ keyValuePairs.join('&');
}

const ProjectList = () => {
  const [jwt, setJwt] = useState('');
  const [data, setData] = useState([] as any);
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
    let jwt = Cookies.get('jwt')?.toString()
    if ( typeof(jwt) == 'undefined' && jwt == null){
      throw Error("error: No access token. Please login first.");
    }
    setJwt(String(jwt))

    const queryString = objToQueryString({
      "name": searchQuery,
      "is_printed": status
    });

    fetch(`http://localhost:8000/api/v1/project/`+queryString, {
      method: 'GET', 
      headers: {'Authorization': "bearer "+jwt},
      })
      .then((response) => {
        if (response.ok) {
            return response.json()
        }
      }).then((data) => {
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
          'is_printed': String(element.is_printed) === "true"? "Printed" : "Open" }));
        setData(result)
      })
      .catch((error) => {
        console.log('error: ' + error);
      });
  }, [searchQuery, status]);
  

  const handleSearchQueryChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearchQuery(event.target.value);
  };

  const handleCreateProject = () => {
    navigate("/newproject")
    return
  };
  
  const handleStatusChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setStatus(event.target.value);
  };
  
  const handleRowClick = (id: number) => {
    let targetProject
    for (const sharedField of data) {
      if (id == sharedField.id) {
        targetProject = sharedField
        break;
      }
    }
    navigate("/editproject",{state:{data:[targetProject], project_id:id}})
    return
  };
  
  const handleProfile = () => {
    navigate("/profile")
    return
  };

  const handleLogoutLink = () => {
    fetch(`http://localhost:8000/api/v1/user/logout`, {
      method: 'POST', 
      headers: {'Authorization': "bearer "+jwt},
      })
      .then((response) => {
        if (response.ok) {
            return response.json()
        }
      }).then((data) => {
        if (data!=null){
          Cookies.remove("jwt")
          navigate("/")
          return
        }
      })
      .catch((error) => {
        console.log('error: ' + error);
      });
      
  };

  return (
    <div className='wrap-login100'>
      <form>
        <div>
          <label htmlFor="searchQuery">Search:</label>
          <input
            type="text"
            id="searchQuery"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            placeholder="filter project name here"
          />
        </div>

        <div>
          <label htmlFor="Status">Status:</label>
          <select id="Status" value={status} onChange={handleStatusChange}>
            <option value="">All</option>
            <option value="false">Open</option>
            <option value="true">Printed</option>
          </select>
        </div>
        <div>
        <button 
            type="submit"
            className={`rounded-full bg-[#3D5FD9] text-[#F5F7FF] w-[25rem] p-3 mt-5 hover:bg-[#2347C5] mb-5`}
            onClick={handleCreateProject}
            >
            New Project
          </button>
        </div>
      {data.length > 0 && (
        <table className="wrapper" >
          <thead>
            <tr>
              <th className="box a noHover">Name</th>
              <th className="box b noHover">Description</th>
              <th className="box c noHover">Date<br/>(local time)</th>
              <th className="box d noHover">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item: { id: number; name: string; description: string; start_at: string; is_printed: string; }) =>
              <tr key={item.id}  onClick={() => handleRowClick(item.id)}> 
                <td className="box a">{item.name}</td>
                <td className="box b">{item.description}</td>
                <td className="box c">{item.start_at}</td>
                <td className="box d">{item.is_printed}</td>
              </tr> 
            )}
          </tbody>
        </table>
      )}
      </form>
      <div>
        <img src="../src/assets/profile.png" width={150} onClick={handleProfile}></img>
        <label onClick={handleLogoutLink} className="txt2 mb-5">
          Log Out
        </label>
      </div>
    </div>
  );
};

export default ProjectList;