import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import "../stylesheets/ChatBox.css";

export default function ChatBox({
  messages,
  sendMessage,
  messageText,
  setMessageText,
}) {
  const currentUser = useSelector((state) => state.currentUser);
  const scrollRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  // Scroll the chatbox to the bottom when a new message is recieved
  useEffect(() => {
    scrollRef.current.scrollTop = 10000;
  }, [messages]);

  return (
    <div className="chat-wrapper">
      <h3>Live Chat</h3>
      <ul className="messages-wrapper" ref={scrollRef}>
        {messages.map((message, i) => (
          <li key={i} className={currentUser.username === message.user ? "local message" : "message" }>
            {" "}
            <strong>{message.user}</strong> <p>{message.text}</p>
          </li>
        ))}
      </ul>

      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          placeholder="Make a guess"
          onChange={(e) => setMessageText(e.target.value)}
          value={messageText}
        />
      </form>
    </div>
  );
}
