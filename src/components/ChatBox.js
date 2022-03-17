import React from 'react'

export default function ChatBox({messages, sendMessage, messageText, setMessageText}) {

  const handleSubmit=(e)=>{
    e.preventDefault()
    sendMessage()
  }


  return (
    <div>
      <h3>Chat box</h3>
      <ul>
        {messages.map((message, i )=> <li key={i} > <strong>{message.user}</strong> {message.text}</li> )}
      </ul>

      <form onSubmit={(e)=>handleSubmit(e)}>
        <input 
          type="text" 
          onChange={(e)=>setMessageText(e.target.value)} 
          value={messageText}  
          />
        <button>Send</button>
      </form>
    
    </div>
  )
}
