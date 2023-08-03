import React from "react";

import "./Message.css";

function Message({ content, sender }) {
    console.log(sender);
    return (
        <div className={`${sender === "me" ? "me" : "my-interlocutor"} conversation-message`}>
            <p  style={{margin: "0"}}>{content}</p>
        </div>
    )
}

export default Message;