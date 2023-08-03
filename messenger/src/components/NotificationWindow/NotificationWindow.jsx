import React, { useState } from "react";

import "./NotificationWindow.css";

import friendRequestIcon from "../../assets/c582d70.png";
import friendRequestActiveIcon from "../../assets/970a861.png";

import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';
import { fetchNotification } from "../../support";


function NotificationWindow() {

    const [notifications, setNotifications] = useState(null);
    const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

    const [isHovering, setIsHovering] = useState(Array(4).fill(false));
    const [isChosen, setIsChosen] = useState(null);
    const notificationTypeIcons = [friendRequestIcon];
    const notificationTypeActiveIcons = [friendRequestActiveIcon];
    const notificationTagTitles = ["Friend Request"];



    return (
        <div className="notification-window">
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
                    {notifications && (isLoadingNotifications === true ? <p>Is Loading</p> : notifications.map((notification, index) => (
                        <div className="notification" key={index}>
                            <h3 className="notification-title">{notification.content.title}</h3>
                            <p className="notification-content">{notification.content.body}</p>
                        </div>
                    )))}
                </div>
            </div>
        </div>
    )
}



export default NotificationWindow;