import React, { useState, useEffect } from "react";
import "./RealTimeMessage.css";
import dayjs from "dayjs";
import avatar from "../../../assets/User.png";

import Message from "../Message/Message";

function RealTimeMessage({ RealTimeProps, interlocutorData }) {

    const messages = [...RealTimeProps.messages];
    messages.reverse();
    return (
        <div id="RealTimeMessage">
            {messages.map((message, index) => {
                return <Message key={index} content={message.content} sender={RealTimeProps.usernames[message.sender] === interlocutorData.username ? null : "me"} sent_at={message.sent_at} index={index} />
            })}
        </div>
    )
}

export default RealTimeMessage;