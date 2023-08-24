import React, { useEffect, useState } from "react";

import "./Dashboard.css";

import Left from "../Left/Left/Left";
import Right from "../Right/Right/Right";
import Loading from "../Loading/Loading";
import NotificationWindows from "../NotificationWindow/NotificationWindows";
import FriendsDiscoveringWindows from "../FriendsDiscoveringWindow/FriendsDiscoveringWindows";


import { checkSession, fetchContact } from "../../support";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    const [isIn, setIsIn] = useState([1, 0, 0]); 
    // first position is main dashboard
    // second position is in friend discorvering windows
    // third position is in notification windows

    const [isLoading, setIsLoading] = useState(true);
    const [interlocutorDatas, setInterlocutorDatas] = useState(null);
    const [conversations, setConversations] = useState(null);

    useEffect(() => {
        checkSession()
            .then(result => {
                if (result === false) navigate('/');
                else {
                    try {
                        (async () => {
                            const results = await fetchContact(); 
                            setInterlocutorDatas(results.interlocutor);
                            setConversations(results.conversations);
                            setIsLoading(false);
                        }) ();
                    } catch (error) {
                        console.log(error);
                    }
                }
            })
    })
    

    const handleKeyDown = async (e) => {
        e.preventDefault();
        if (isIn[0] !== 1) {
            if (e.key === "Escape") {
                setIsIn([1, 0, 0]);
            }
        }
    }

    const [currentConversationIndex, setCurrentConversationIndex] = useState(null);

    if (isLoading) return <Loading />;
    else return (
        <div id="dashboard" onKeyDown={handleKeyDown} tabIndex="0">
            {(isIn[2] === 1) && <FriendsDiscoveringWindows setIsIn={setIsIn} />}
            {(isIn[1] === 1) && <NotificationWindows setIsIn={setIsIn} />}
            {!isIn[0] && <div className="overlay" />}
            <div className="Chat_Path">
                <Left setCurrentMessageIndex={setCurrentConversationIndex} interlocutorDatas={interlocutorDatas} setIsIn={setIsIn} isIn={isIn} />
                <div id="separate-line" />
                <Right conversationData={currentConversationIndex === null ? null : conversations[currentConversationIndex]} interlocutorData={interlocutorDatas[currentConversationIndex]} setConversations={setConversations} />
            </div>
        </div>
    )
};

export default Dashboard;