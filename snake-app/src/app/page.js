'use client'

import React from "react";
import GameHandler from "./components/GameHandler";
import { useEffect, useState } from "react";
import socket from "./socket";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(()=>{
    socket.on("message", (msg)=>{
      setMessages((prev)=>[...prev, msg])
    });
    return ()=>{
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    socket.emit("message", input);
    setInput("");
  };

  return (
    // <div className="absolute">
    //   <h1>Socket.IO Chat</h1>
    //   <input className="white" value={input} onChange={(e)=>setInput(e.target.value)} typeholder="Type a message"></input>
    //   <button onClick={sendMessage}>Send</button>
    //   <ul>
    //     {messages.map((msg, i)=> (<li key={i}>{msg}</li>))}
    //   </ul>
    // </div>
    <React.Fragment>
      <GameHandler/>
    </React.Fragment>
  )
    
}
