import React, { useState} from 'react';
import axios from 'axios';
import Stars from './Stars';
import logo from './asserts/logo.png';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);

  // method to send msg to fastapi backend
  const sendMessage = async () => {
    if (message.trim() !== ''){
      // setChatLog((prevLog) => [...prevLog, { sender: 'you', text: message}]);

      try{
        const response = await axios.post('http://127.0.0.1:8000/chatbot/', { message: message });
        setChatLog((prevLog) => [...prevLog, { sender: 'You', text: message }, {sender: 'Bot', text: response.data.response}]);

      }catch (error) {
        setChatLog((prevLog) => [...prevLog, { sender: 'Bot', text: 'Error communicating fastApi.'}]);
      }
      setMessage('');
    }
  };

  return (
    <div className='App'>
      <Stars />
      <div className='chat-container'>
      <img src={logo} alt="Chatbot Logo" className="Clogo" />
        <div className='chat-log'>
          {chatLog.map((chat, index) => (
            <div key={index} className={chat.sende === 'You' ? 'chat-message user' : 'chat-message bot'}>
              <strong>{chat.sender}:</strong> {chat.text}
            </div>
          ))}
        </div>

        <div className='chat-input'>
        <img src={logo} alt="Chatbot Logo" className="logo" />
          <input
          type='text'
          placeholder='Type your message...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
