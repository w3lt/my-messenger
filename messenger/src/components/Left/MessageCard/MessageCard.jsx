import React, { useState, useEffect } from "react";
import "./MessageCard.css";
import dayjs from "dayjs";
import avatar from "../../../assets/User.png";

function MessageCard({ messageProps }) {
    const [isUnread, setIsUnread] = useState(!(messageProps.unread_messages === 0));

    return (
        <div className="message-card">
            <div className="message-left-components">
                <img src={messageProps.avatar === null ? avatar : messageProps.avatar} alt="avatar" className="message-avatar" />
                <div className="">
                    <div className={`message-username ${isUnread ? 'unread-message' : ''}`}>{messageProps.username}</div>
                    <div className={`last-message ${isUnread ? 'unread-message' : ''}`}>{messageProps.lastMessage}</div>
                </div>
            </div>
            
            <div className="message-right-components">
                <div className="">{messageProps.number_unread_message}</div>
                <div className="receiving-time">{dayjs(new Date(messageProps.receivingTime)).format("ddd, DD/MM/YYYY HH:mm")}</div>
            </div>
        </div>
    )
}

export default MessageCard;