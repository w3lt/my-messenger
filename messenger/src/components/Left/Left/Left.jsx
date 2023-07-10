import React, {useState, useEffect} from 'react';
import Messenger from '../../../assets/Messenger.png';
import LogOut from '../../../assets/LogOut.png';
import Search from '../../../assets/Search.png';
import Chat from '../../../assets/Chat.png';
import People from '../../../assets/People.png';
import CreateGroup from '../../../assets/CreateGroup.png';

import usersData from '../../../fake_dataset.json';

import "./Left.css";
import MessageCard from '../MessageCard/MessageCard';

const SideBar = () => (
    <div className= "left_sidebar">
        <div className= "left_sidebar_icon1">
            <div className= "left_sidebar_pic1">
                <img src={Chat} alt="Chat" width={30}/>
            </div>
        </div>
        <div className= "left_sidebar_icon2">
            <div className= "left_sidebar_pic2">
                <img src={People} alt="People" width={30}/>
            </div>
        </div>
        <div className= "left_sidebar_icon3">
            <div className= "left_sidebar_pic3">
                <img src={LogOut} alt="LogOut" width={30}/>
            </div>
        </div>
    </div>
)

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
                    />
                    <textarea 
                        classsName="toolsbar_input_text" 
                        placeholder="Search" 
                        rows={1}
                    />
                </div>
                <button className='create-group-button'><img src={CreateGroup} alt="create-group" className='create-group' /></button>
            </div>
        // </div>
    )
}

const Left = ({ setCurrentMessage }) => {

    const [chosenMessage, setChosenMessage] = useState(null);

    return (
        <div id='Left'>
            <div className="left_sidebar_wrapper">
                <SideBar />
            </div>
            <div 
                style={{flexDirection: "row"}}
            >
                <div className="left_wrapper">
                    <Header />
                    <ToolsBar />
                </div>
                <div id='messages'>
                    {usersData.map((userData, index) => (
                        <div onClick={() => {setCurrentMessage(userData);setChosenMessage(index);}} className={`message ${chosenMessage === index ? 'chosen-message' : ''}`} >
                            <MessageCard messageProps={userData} />
                        </div>
                        
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Left;
