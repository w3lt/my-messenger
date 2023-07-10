import React from "react";
import "./UserInterlocutor.css";

import User from '../../../assets/User.png';
import Phonecall from '../../../assets/Phonecall.png';
import Videocall from '../../../assets/Videocall.png';

function UserInterlocutor ({ userProps }) {
    return (
        <div className="UserInterlocutor_left">
            <div
                style={{display: "flex", padding: "5px 0"}}
            >
                <img src={User} alt="User" className="button-img" />
                <div className="user-info">
                    <div className="user-name" >{userProps.name}</div>
                    <div className="user-status" >Active now</div>
                </div>
            </div>
            <div
                style={{display: "flex", alignContent: "center"}}
            >
                <img src={Phonecall} alt="Phonecall" className="button-img" />
                <img src={Videocall} alt="Videocall" className="button-img" />
                
            </div>
        </div>
    )
}

export default UserInterlocutor;