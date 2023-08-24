import React, { useState } from 'react';

import image from '../../../assets/image.png';
import sticker from '../../../assets/sticker.png';
import messageSendingImg from "../../../assets/send.png";
import messageSendingHoverImg from "../../../assets/send-hover.png";

import UserInterlocutor from '../UserInterlocutor/UserInterlocutor';
import RealTimeMessage from '../RealTimeMessage/RealTimeMessage';

import "./Right.css";
import { sendMessage } from '../../../support';

import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';


const Right = ({ conversationData, interlocutorData, setConversations }) => {

  // const [conversationData, setConversationData] = useState(currentConversationData);

  const [currentMessage, setCurrentMessage] = useState('');

  const handleKeyDown = async (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      setCurrentMessage('');
      await submitMessage();
    }
  };

  async function submitMessage() {
    const newConversationData = await sendMessage(conversationData.usernames[1 - conversationData.usernames.indexOf(interlocutorData.username)], interlocutorData.username, currentMessage);
    setConversations(previous => {
      for (let i=0; i < previous.length; ++i) {
        if (previous[i]._id === newConversationData._id) {
          previous[i] = newConversationData;
          return previous;
        }
      }
      
    })
  }


  // Used for sending buttom
  const [isHovering, setIsHovering] = useState(false);

  if (conversationData === null) return null;
  else return (
    <div id="Right">
      <div className="UserInterlocutor_wrapper">
        <UserInterlocutor userProps={interlocutorData} />
      </div>
      <div className="Realtime">
        <RealTimeMessage RealTimeProps={conversationData} interlocutorData={interlocutorData} />
      </div>



      <div className="TypeMessage">
        <div className="TypeMessageComponents">
          <img src={image} alt="image" className='media-input-img' />
          <img src={sticker} alt="sticker" className='media-input-img' />
          <div className="type-box">
            <textarea
              placeholder='Write message'
              rows={1}
              value={currentMessage}
              onChange={e => setCurrentMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div onMouseEnter={() => {setIsHovering(true)}} onMouseLeave={() => {setIsHovering(false)}}>
            <img src={isHovering ? messageSendingHoverImg : messageSendingImg} alt="send" onClick={async () => {await submitMessage()}}
              style={{width: "30px", height: "30px", margin: "auto 5px"}}
            />
          </div>
        </div>
      </div>
    </div>
  )
};
// , function (previous, current) {
//   const previousData = previous.conversationData;
//   const currentData = current.conversationData;
//   if (previousData === null) {
//     if (currentData === null) return true;
//     else return false;
//   } else return previousData._id === currentData._id;
// });

export default Right;