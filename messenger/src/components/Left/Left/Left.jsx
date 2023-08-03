import React, {useState, useEffect} from 'react';
import Messenger from '../../../assets/Messenger.png';
import LogOut from '../../../assets/LogOut.png';
import Search from '../../../assets/Search.png';
import Chat from '../../../assets/Chat.png';
import People from '../../../assets/People.png';
import CreateGroup from '../../../assets/CreateGroup.png';
import Notification from '../../../assets/notification.png';
import NotificationActive from '../../../assets/notification_active.png';


import NotificationWindow from '../../NotificationWindow/NotificationWindow';

import fake_dataset from '../../../fake_dataset.json';


// import usersData from '../../../fake_dataset.json';

import "./Left.css";
import MessageCard from '../MessageCard/MessageCard';
import { logout } from '../../../support';

const SideBar = () => {

    async function handleLogoutRequest() {
        try {
            const result = await logout();
            console.log(result);
            if (result === 0) {
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    }



    // Used for notification
    const [isClicking, setIsClicking] = useState(false);

    return <div className= "left_sidebar">
        <div className= "left_sidebar_icon" id='left_sidebar_top_icon'>
            <div className= "left_sidebar_pic">
                <img src={Chat} alt="Chat" width={30}/>
            </div>
        </div>
        <div className= "left_sidebar_icon">
            <div className= "left_sidebar_pic">
                <img src={People} alt="People" width={30}/>
            </div>
        </div>
        <div className= "left_sidebar_icon" style={{position: "relative"}} onClick={() => {setIsClicking(previous => !previous)}}>
            <div className= "left_sidebar_pic">
                <img src={isClicking ? NotificationActive : Notification} alt="Notification" width={30}/>
            </div>
            <div className="notification-badge" id="notification-badge">2</div>
        </div>
        <div className= "left_sidebar_icon">
            <div className= "left_sidebar_pic" onClick={handleLogoutRequest}>
                <img src={LogOut} alt="LogOut" width={30}/>
            </div>
        </div>
        {isClicking && <NotificationWindow notifications={fake_dataset.notifications} />}
        
    </div>
}

const Header = () => {
    return (
        <div className="left_header">
            <div className="left_header_icon">
                <img src={Messenger} alt="Messenger" width={30}/>
            </div>
            <h1 className="left_header_text">Messenger</h1>
        </div>
    )
}

const ToolsBar = () => {
    return (
        // <div className="toolsbar">
            <div className="toolsbar_wrapper">
                <div className="toolsbar_search">
                    <img 
                        src={Search} 
                        alt="Search" 
                        width={20}
                        style={{margin: "0 5px 0 10px"}}
                    />
                    <textarea 
                        className="toolsbar_input_text" 
                        placeholder="Search" 
                        rows={1}
                    />
                </div>
                <button className='create-group-button'><img src={CreateGroup} alt="create-group" className='create-group' /></button>
            </div>
        // </div>
    )
}

const Left = ({ setCurrentMessageIndex, interlocutorDatas }) => {


    const [chosenMessage, setChosenMessage] = useState(null);

    return (
        <div id='Left'>
            <div className="left_sidebar_wrapper">
                <SideBar />
            </div>
            <div 
                style={{flexDirection: "row"}}
            >
                <Header />
                <ToolsBar />
                <div id='messages'>
                    {interlocutorDatas.map((userData, index) => (
                        <div key={index} onClick={() => {setCurrentMessageIndex(index);setChosenMessage(index);}} className={`my-message ${chosenMessage === index ? 'chosen-message' : ''}`} >
                            <MessageCard messageProps={userData} />
                        </div>
                        
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Left;
