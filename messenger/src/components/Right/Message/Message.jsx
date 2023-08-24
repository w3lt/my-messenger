import React from "react";

import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';
import dayjs from "dayjs";


import "./Message.css";

function Message({ content, sender, sent_at, index }) {
    return (
            <div className={`${sender === "me" ? "me" : "my-interlocutor"} ${"message-"+index} conversation-message`}>
                <p style={{margin: "0"}}>{content}</p>
                <Tooltip anchorSelect={".message-"+index} place="left-start" content={dayjs(new Date(sent_at)).format("ddd, DD/MM/YY HH:mm")} delayShow={300}
                    positionStrategy="fixed"
                />
            </div>
        
    )
}

export default Message;