import React, { useState } from "react";

import "./NotificationWindows.css";

import friendRequestIcon from "../../assets/c582d70.png";
import friendRequestActiveIcon from "../../assets/970a861.png";
import turnOff from "../../assets/cancel.png";
import acceptSymbol from "../../assets/accept_symbol.png";
import refuseSymbol from "../../assets/refuse_symbol.png";
import acceptHoverSymbol from "../../assets/accept_symbol_hover.png";
import refuseHoverSymbol from "../../assets/refuse_symbol_hover.png";

import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';
import { fetchNotification, handleFriendRequest, readNotifications } from "../../support";
import Loading from "../Loading/Loading";


function NotificationWindow({setIsIn}) {

    const [isHoveringResponseButton, setIsHoveringResponseButton] = useState([-1, -1]);

    const [notifications, setNotifications] = useState(null);
    const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

    const [isHovering, setIsHovering] = useState(Array(4).fill(false));
    const [isChosen, setIsChosen] = useState(null);
    const notificationTypeIcons = [friendRequestIcon];
    const notificationTypeActiveIcons = [friendRequestActiveIcon];
    const notificationTagTitles = ["Friend Request"];

    return (
        <div className="notification-window">
            <img src={turnOff} alt="" style={{width: "15px", height: "15px", position: "absolute", top: "10px", right: "10px"}} onClick={() => {setIsIn([1, 0, 0])}} />
            <div className="notification-window-title">Notifications</div>
            <div className="notification-window-main-content">
                <div className="notification-tags">
                    {notificationTypeIcons.map((notificationTypeIcon, index) => {
                        return (
                            <div key={index}
                                onMouseEnter={() => {setIsHovering(previous => {previous[index] = true; return previous;})}}
                                onMouseLeave={() => {setIsHovering(previous => {previous[index] = false; return previous;})}}
                                onClick={async () => {
                                    setIsLoadingNotifications(true);
                                    setIsChosen(index);
                                    try {
                                        const data = await fetchNotification(0);
                                        setNotifications(data);
                                        await readNotifications(0);
                                    } catch (error) {
                                        console.log(error);
                                    }
                                    
                                    setIsLoadingNotifications(false);
                                }}
                                className="notification-icon-container"
                                id={isChosen === index ? "chosen-notification-tag" : ""}
                            >
                                <Tooltip anchorSelect=".notification-icon-container" place="top-start" content={notificationTagTitles[index]} delayShow={300}
                                    positionStrategy="fixed"
                                />
                                <img className="notification-icon" src={(isHovering[index] === true) || (isChosen === index) ? notificationTypeActiveIcons[index] : notificationTypeIcon} alt="" />
                            </div>
                        )
                    })}
                </div>
                <div style={{
                    width: "0",
                    height: "100%",
                    border: "solid #F2F4F9 1px",
                    borderRadius: "1px",
                    display: "inline-block",
                    margin: "auto 10px"
                }}/>
                <div className="notifications-container">
                    {notifications && (isLoadingNotifications === true ? <Loading/> : notifications.map((notification, index) => {
                        const sender = notification.content.title;
                        return <div className="notification" key={index}>
                            <img src={`data:image/jpeg;base64,${notification.avatar}`} alt="" className="notification-avatar" />
                            <div className="notification-content">
                                <h3 className="notification-title">{sender}</h3>
                                <p className="notification-body">{notification.content.body}</p>
                            </div>
                            {!notification.is_response && <div className="response-container">
                                <div className="response-button" onMouseEnter={() => {setIsHoveringResponseButton([index, 0])}} onMouseLeave={() => {setIsHoveringResponseButton([-1, -1])}} onClick={async () => {if (await handleFriendRequest(sender, 0) === 0) notification.is_response = true;}}>
                                    <img src={(isHoveringResponseButton[0] === index && isHoveringResponseButton[1] === 0) ? acceptHoverSymbol : acceptSymbol} alt="" style={{width: "20px", height: "20px"}} />
                                </div>
                                <div className="response-button" onMouseEnter={() => {setIsHoveringResponseButton([index, 1])}} onMouseLeave={() => {setIsHoveringResponseButton([-1, -1])}} onClick={async () => {if (await handleFriendRequest(sender, 1) === 0) notification.is_response = true;}}>
                                    <img src={(isHoveringResponseButton[0] === index && isHoveringResponseButton[1] === 1) ? refuseHoverSymbol : refuseSymbol} alt="" style={{width: "15px", height: "15px"}} />
                                </div>
                            </div>}
                        </div>
                    }))}
                </div>
            </div>
        </div>
    )
}



export default NotificationWindow;