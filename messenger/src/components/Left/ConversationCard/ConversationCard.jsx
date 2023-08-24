import React, { useState, useEffect } from "react";
import "./ConversationCard.css";
import dayjs from "dayjs";
import avatar from "../../../assets/User.png";

function MessageCard({ messageProps }) {
    const [isUnread, setIsUnread] = useState(!(messageProps.unread_messages === 0));

    return (
        <div className="conversation-card">
            <img src={`data:image/jpeg;base64,${messageProps.avatar}`} alt="avatar" className="message-avatar" />
            <div style={{display: "flex", flexGrow: 1, flexDirection: "column"}}>
                <div className="conversation-infor-up-line">
                    <div className={`message-username ${isUnread ? 'unread-message' : ''}`}>{messageProps.username}</div>
                    <div>{dayjs(new Date(messageProps.receivingTime)).format("ddd, DD/MM/YY")}</div>
                </div>
                <div className={`last-message ${isUnread ? 'unread-message' : ''}`}>{!messageProps.lastMessageSender ? "You: " : ""}{messageProps.lastMessage} <span>{messageProps.number_unread_message}</span></div>
            </div>
        </div>
    )
}

export default MessageCard;