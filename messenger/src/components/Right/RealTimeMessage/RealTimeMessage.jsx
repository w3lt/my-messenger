import React, { useState, useEffect } from "react";
import "./RealTimeMessage.css";
import dayjs from "dayjs";
import avatar from "../../../assets/User.png";

function RealTimeMessage ({ RealTimeProps }) {
    console.log(RealTimeProps);
    return (
        <div className="RealTimeMessage">
            <div className="RealTimeMessage-right">
                <img src={avatar} alt="avatar" className="message-avatar" />
                <div className="right-component1">
                    {RealTimeProps.name}
                </div>
                <div className="right-component1">
                    {RealTimeProps.last_message}
                </div>
                <div className="middle-component">
                    <div className="">{RealTimeProps.unread_messages}</div>
                    <div className="">{dayjs(new Date(RealTimeProps.receiving_time)).format("ddd, DD/MM/YYYY HH:mm")}</div>
                </div>
                <div className="">{RealTimeProps.receiving_time}</div>
            </div>
        </div>
    )
}

export default RealTimeMessage;