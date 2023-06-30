import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from './App'

import './global.css';
import './util.css';

import RouterError from './components/RouterError';
import SignIn from './components/Forms/SignIn';
import SignUp from './components/Forms/SignUp';
import Registered from './components/Registered';
import EditProject from './components/Forms/EditProject';
import EditProjectDetail from './components/Forms/EditProjectDetail';
import Profile from './components/Forms/Profile';
import ProjectList from './components/Forms/ProjectList';
import NewProject from './components/Forms/NewProject';
import EditProduct from './components/Forms/EditProduct';
import NewProduct from './components/Forms/NewProduct';


const router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
    errorElement: <RouterError />,
  },
  {
    path: "/registered",
    element: <Registered/>,
    errorElement: <RouterError />,
  },
  {
    path: "/editproject",
    element: <EditProject/>,
    errorElement: <RouterError />,
  },
  {
    path: "/editprojectdetail",
    element: <EditProjectDetail/>,
    errorElement: <RouterError />,
  },
  {
    path: "/projectlist",
    element: <ProjectList/>,
    errorElement: <RouterError />,
  },
  {
    path: "/profile",
    element: <Profile/>,
    errorElement: <RouterError />,
  },
  {
    path: "/newproject",
    element: <NewProject/>,
    errorElement: <RouterError />,
  },
  {
    path: "/editproduct",
    element: <EditProduct/>,
    errorElement: <RouterError />,
  },
  {
    path: "/newproduct",
    element: <NewProduct/>,
    errorElement: <RouterError />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
    <div className='App'>
      <div>
          <RouterProvider router={router} />
      </div>
    </div>
    </React.StrictMode>
)
