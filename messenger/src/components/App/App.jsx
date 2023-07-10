import React, { useEffect, useState } from 'react';
import Left from "../Left/Left/Left";
import Right from "../Right/Right/Right";

import avatar from "../../assets/User.png";
import usersData from '../../fake_dataset.json';

import { checkSession } from '../../support';

import './App.css';
import LoginRegisterForm from '../Login-Register-Form/LoginRegisterForm';

function App(props) {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const result = await checkSession();
        console.log(result);
        setIsLoggedIn(result);
        setIsLoading(false);
      } catch (error) {
        // console.log(error);
      }
    }) ();

    
    
  }, [isLoggedIn]);


  const [currentMessage, setCurrentMessage] = useState(null);

  if (isLoading === true) return null;
  else {
    if (isLoggedIn === true) return (
      <div className = "Chat_Path">
        <Left setCurrentMessage={setCurrentMessage} />
        <div id="separate-line" />
        <Right userData={currentMessage} />
      </div>
    );
    else return <LoginRegisterForm />;
  }
}

export default App;