import React, {useState, useEffect} from 'react';
import Logo from '../../../assets/logo.png';
import LogOut from '../../../assets/LogOut.png';
import Search from '../../../assets/Search.png';
import Chat from '../../../assets/Chat.png';
import People from '../../../assets/People.png';
import PeopleActive from '../../../assets/People_active.png';
import CreateGroup from '../../../assets/CreateGroup.png';
import Notification from '../../../assets/notification.png';
import NotificationActive from '../../../assets/notification_active.png';
import Group from "../../../assets/group.png";
import GroupActive from "../../../assets/group_active.png";


// import usersData from '../../../fake_dataset.json';

import "./Left.css";
import MessageCard from '../ConversationCard/ConversationCard';
import { createGroup, fetchNumberUnreadNotification, logout } from '../../../support';

const SideBar = React.memo(({ setIsIn, isIn }) => {

    const [numberUnreadNotification, setNumberUnreadNotification] = useState(0);
    const [isHovering, setIsHovering] = useState(0);

    useEffect(() => {
        (async () => {
            const numberUnreadNotification = await fetchNumberUnreadNotification();
            setNumberUnreadNotification(numberUnreadNotification);
        }) ();
    });

    async function handleLogoutRequest() {
        try {
            const result = await logout();
            if (result === 0) {
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    }



    // Used for notification

    return <div className= "left_sidebar">
        <div className= "left_sidebar_icon" id='left_sidebar_top_icon'>
            <div className= "left_sidebar_pic">
                <img src={Chat} alt="Chat" width={30}/>
            </div>
        </div>
        <div className="left_sidebar_icon" onClick={() => {setIsIn([0, 0, 1])}} >
            <div className= "left_sidebar_pic">
                <img src={isIn[2] === 1 ? PeopleActive : People} alt="People" width={30}/>
            </div>
        </div>
        <div className= "left_sidebar_icon" style={{position: "relative"}} onClick={() => {setIsIn([0, 1, 0])}}>
            <div className= "left_sidebar_pic">
                <img src={isIn[1] === 1 ? NotificationActive : Notification} alt="Notification" width={30}/>
            </div>
            {(numberUnreadNotification !== 0) && <div className="notification-badge" id="notification-badge">{numberUnreadNotification}</div>}
        </div>
        <div className= "left_sidebar_icon" style={{position: "relative"}}>
            <div className= "left_sidebar_pic">
                <img src={Group} alt="Notification" width={30}/>
            </div>
        </div>
        <div className= "left_sidebar_icon">
            <div className= "left_sidebar_pic" onClick={handleLogoutRequest}>
                <img src={LogOut} alt="LogOut" width={30}/>
            </div>
        </div>        
    </div>
})

const Header = () => {
    return (
        <div className="left-header-container">
            <h1 className="left-header">Wibu <img src={Logo} alt="Logo" className='left-header-logo'/> Bar</h1>
        </div>
    )
}

const ToolsBar = ({searchValue, setSearchValue}) => {

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
                        value={searchValue}
                        onChange={e => {setSearchValue(e.target.value)}}
                        rows={1}
                    />
                </div>
                <button className='create-group-button' onClick={async () => {await createGroup("Hello", 0)}}><img src={CreateGroup} alt="create-group" className='create-group' /></button>
            </div>
        // </div>
    )
}

const Left = React.memo(({ setCurrentMessageIndex, interlocutorDatas, setIsIn, isIn }) => {

    const [searchValue, setSearchValue] = useState('');
    const [chosenMessage, setChosenMessage] = useState(null);
    const [filteredInterlocutorDatas, setFilteredInterlocutorDatas] = useState(interlocutorDatas);

    useEffect(() => {
        const regex = new RegExp(searchValue, 'i'); // 'i' flag makes the regex case-insensitive
        const filteredData = interlocutorDatas.filter(userData => {
            return regex.test(userData.username); // Check if the username matches the searchValue using the regex
        });
        setFilteredInterlocutorDatas(filteredData);
    }, [searchValue, interlocutorDatas]);

    return (
        <div id='Left'>
            <div className="left_sidebar_wrapper">
                <SideBar setIsIn={setIsIn} isIn={isIn} />
            </div>
            <div 
                style={{flexDirection: "row", flexGrow: 1}}
            >
                <Header />
                <ToolsBar searchValue={searchValue} setSearchValue={setSearchValue} />
                <div id='conversations'>
                    {filteredInterlocutorDatas.map((userData, index) => {
                        return <div key={index} onClick={() => {setCurrentMessageIndex(index);setChosenMessage(index);}} className={`my-conversation ${chosenMessage === index ? 'chosen-conversation' : ''}`} >
                            <MessageCard messageProps={userData} />
                        </div>
                    })}
                </div>
            </div>
        </div>
    );
})

export default Left;