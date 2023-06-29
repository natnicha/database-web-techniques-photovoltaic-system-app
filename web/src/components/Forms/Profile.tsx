import { useState, useEffect } from 'react';
import {useLocation, useNavigate}  from "react-router-dom";
import '../../global.css';
import Cookies from 'js-cookie';

export default function ManageProfile() {
  const navigate = useNavigate()
  const [jwt, setJwt] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    let jwt = Cookies.get('jwt')?.toString()
    if ( typeof(jwt) == 'undefined' && jwt == null){
      throw Error("error: No access token. Please login first.");
    }
    setJwt(String(jwt))
    
    fetch(`http://localhost:8000/api/v1/user/`, {
      method: 'GET', 
      headers: {'Authorization': "bearer "+jwt},
      })  
      .then((response) => {
        if (response.ok) {
            return response.json()
        }
      }).then((data) => {
        if (data != null) {
          setFirstName(data.data.first_name)
          setLastName(data.data.last_name)
          setEmail(data.data.email)
        }
      })
      .catch((error) => {
        console.log('error: ' + error);
      });

  }, []);

  const handleBackLink = () => {
    navigate("/projectlist")
    return
  };

  const handleSave = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (password!=confirmPassword || password=='') {
      setFeedback("Please input password or passwords are not the same.")
    } else {
      let data = {
        'first_name':firstName,
        'last_name':lastName,
        'email':email,
        'password':password,
      }
      fetch(`http://localhost:8000/api/v1/user/update`, {
      method: 'PUT', 
      headers: {'Authorization': "bearer "+jwt},
      body: JSON.stringify(data)
      })
      .then((response) => {
        if (response.ok) {
            return response.json()
        }
      }).then((data) => {
        setFirstName(data.data.first_name)
        setLastName(data.data.last_name)
        setEmail(data.data.email)
        setPassword("xxxxxxxxxx")
        setConfirmPassword("xxxxxxxxxx")
        setFeedback("saved succesfully")
      })
      .catch((error) => {
        console.log('error: ' + error);
      });
    }
  }
  
  const handleDelete = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    fetch(`http://localhost:8000/api/v1/user/delete`, {
    method: 'DELETE', 
    headers: {'Authorization': "bearer "+jwt},
    })
    .then((response) => {
      if (response.ok) {
          return response.json()
      }
    }).then((data) => {
      navigate("/")
      return
    }).catch((error) => {
      console.log('error: ' + error);
    });
  }

  return (
    <div className="py-6 flex flex-col justify-center relative overflow-hidden">
      <div className="relative px-6 pt-10 pb-8 bg-white shadow-xl ring-1 ring-gray-900/5 sm:max-w-lg sm:rounded-lg sm:px-10">
        <div className="max-w-md mx-auto">
          <div className="divide-y divide-gray-300/50">
            <div className="py-8 text-base leading-7 space-y-6 text-blue-600">
              <h1 className="text-2xl font-bold">Personal Profile</h1>
              <form className="w-full max-w-lg">
                <div className="mb-6">
                  <label htmlFor="firstname" className="block mb-2 text-sm font-bold text-gray-700">First Name</label>
                  <input type="text" id="firstname" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500" />
                </div>

                <div className="mb-6">
                  <label htmlFor="lastname" className="block mb-2 text-sm font-bold text-gray-700">Last Name</label>
                  <input type="text" id="lastname" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500" />
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="block mb-2 text-sm font-bold text-gray-700">Email</label>
                  <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500" />
                </div>

                <div className="mb-6">
                  <label htmlFor="password" className="block mb-2 text-sm font-bold text-gray-700">Password</label>
                  <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500"></input>
                </div>

                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block mb-2 text-sm font-bold text-gray-700">Confirm Password</label>
                  <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500"></input>
                </div>

                <div className="feedback">
                  <label htmlFor="feedback" className="feedback">{feedback}</label>
                </div>

                <div className="mb-6">
                  <button className="rounded-full bg-[#3D5FD9] text-[#F5F7FF] w-[25rem] p-3 mt-5 hover:bg-[#2347C5]"
                  onClick={(e) => handleSave(e)}>Save</button>
                </div>

                <div className="mb-6">
                  <button className="rounded-full bg-[#c80000] text-[#F5F7FF] w-[25rem] p-3 hover:bg-[#af0000]"
                  onClick={(e) => handleDelete(e)}>Delete</button>
                </div>
                <label onClick={handleBackLink} className="txt2 mb-5">
                  Back
                </label>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}