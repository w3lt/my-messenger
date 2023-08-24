import React, { useState } from "react";
import "./FriendsDiscoveringWindows.css";

import { cancelFriendRequest, requestFriendRelationship, searchPeople } from "../../support";
import { status } from "../../library";

import turnOff from "../../assets/cancel.png";
import Search from "../../assets/Search.png";
import Plus from "../../assets/plus.png";
import PlusHover from "../../assets/plus_hover.png";
import StickSymbol from "../../assets/stick_symbol.png";
import StickSymbolHover from "../../assets/stick_symbol_hover.png";



const FriendsDiscoveringWindows = React.memo(({ setIsIn }) => {

    const [searching, setSearching] = useState('');
    const [searchingResults, setSearchingResults] = useState([]);

    const [isHovering, setIsHovering] = useState(-1);


    return (
        <div className="friends-discovering-windows">
            <img src={turnOff} alt="" style={{width: "15px", height: "15px", position: "absolute", top: "10px", right: "10px"}} onClick={() => {setIsIn([1, 0, 0])}} />
            <div className="friend-discovering-window-title">People</div>
                <div className="search-bar">
                    <img 
                        src={Search} 
                        alt="Search" 
                        style={{margin: "0 5px 0 10px", width: "20px", height: "20px"}}
                    />
                    <textarea 
                        value={searching}
                        onChange={async e => {setSearching(e.target.value); setSearchingResults(await searchPeople(e.target.value))}}
                        placeholder="Search"
                        rows={1}
                    />
                </div>
                <div className="search-results">
                    {searchingResults.map((result, index) => {
                        return (<div className="search-result" key={index}>
                            <div className="avatar-container">
                                <img src={`data:image/jpeg;base64,${result.avatar}`} className="search-result-avatar" alt="" />
                                <img src={status[result.currentStatus[0]]} alt="" className="search-result-avatar-status" />
                            </div>
                            <div style={{display: "flex", flexDirection: "column"}}>
                                <div className="search-result-name">{result.username}</div>
                                <div className="search-result-status">{result.signature !== null ? result.signature : 'Active now'}</div>
                            </div>
                            {result.status === null ? <div className="plus-button-container" onMouseEnter={() => {setIsHovering(index)}} onMouseLeave={() => {setIsHovering(-1)}} onClick={async () => {result.is_requested ? (await cancelFriendRequest(result.username)) : (await requestFriendRelationship(result.username))}}>
                                 <img src={isHovering !== index ? Plus : PlusHover} alt="" className="plus-button" />
                            </div> : <div className="friend-relationship-status">{result.status}</div>}
                        </div>)
                    })}
                </div>
        </div>
    )
})

export default FriendsDiscoveringWindows;