import React, { useEffect, useState } from "react";

import "./Dashboard.css";

import Left from "../Left/Left/Left";
import Right from "../Right/Right/Right";
import Loading from "../Loading/Loading";
import { checkSession, fetchContact } from "../../support";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

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
                            const result = await fetchContact();
                            setInterlocutorDatas(result.interlocutor);
                            setConversations(result.conversations);
                            setIsLoading(false);
                        }) ();
                    } catch (error) {
                        console.log(error);
                    }
                }
            })
    })
    

    const [currentConversationIndex, setCurrentConversationIndex] = useState(null);

    if (isLoading) return <Loading />;
    else return (
        <div className = "Chat_Path">
            <Left setCurrentMessageIndex={setCurrentConversationIndex} interlocutorDatas={interlocutorDatas} />
            <div id="separate-line" />
            <Right conversationData={currentConversationIndex === null ? null : conversations[currentConversationIndex]} interlocutorData={interlocutorDatas[currentConversationIndex]} setConversations={setConversations} />
        </div>
    )
}

export default Dashboard;