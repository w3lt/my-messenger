import React, { useState, useEffect } from "react";
import "./RealTimeMessage.css";
import dayjs from "dayjs";
import avatar from "../../../assets/User.png";

import Message from "../Message/Message";

function RealTimeMessage({ RealTimeProps, interlocutorData }) {
    return (
        <div id="RealTimeMessage">
            {RealTimeProps.messages.map((message, index) => {
                return <Message key={index} content={message.content} sender={RealTimeProps.usernames[message.sender] === interlocutorData.username ? null : "me"} />
            })}
        </div>
    )
}

export default RealTimeMessage;