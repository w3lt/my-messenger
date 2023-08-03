import React, { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  useNavigate,
} from "react-router-dom"; 

import Left from "../Left/Left/Left";
import Right from "../Right/Right/Right";

import { checkSession } from '../../support';

import './App.css';
import LoginRegisterForm from '../Login-Register-Form/LoginRegisterForm';
import Dashboard from '../Dashboard/Dashboard';


const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginRegisterForm />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  }
])

function App() {
  return <div className='App'><RouterProvider router={router} /></div>
}

export default App;