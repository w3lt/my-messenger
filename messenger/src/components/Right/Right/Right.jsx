import React from 'react';

import image from '../../../assets/image.png';
import sticker from '../../../assets/sticker.png';
import messageSending from "../../../assets/send.png";

import UserInterlocutor from '../UserInterlocutor/UserInterlocutor';

import "./Right.css";



const TypeMessage = () => {
  return (
    <div className="TypeMessageComponents">
      <img src={image} alt="image" className='media-input-img' />
      <img src={sticker} alt="sticker" className='media-input-img' />
      <div className="type-box">
        <textarea
          placeholder='Write message'
          rows  ={1}
        />
      </div>
      <img src={messageSending} alt="send"
        style={{width: "30px", height: "30px", margin: "auto 5px"}}
      />
    </div>
  )
}

const Right = ({ userData }) => {
  if (userData === null) return null;
  else return (
    <div id="Right">
      <div className="UserInterlocutor_wrapper">
        <UserInterlocutor userProps={userData} />
      </div>
      {/* <div className="Realtime">
        <RealTimeMessage RealTimeProps={userData} />
      </div> */}
      <div className="TypeMessage">
        <TypeMessage />
      </div>
    </div>
  )
}

export default Right;