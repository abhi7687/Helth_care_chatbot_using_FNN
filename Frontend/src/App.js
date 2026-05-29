import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Stars from './Stars';
import logo from './asserts/logo.png';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatLogRef = useRef(null);

  // Auto-scroll to the bottom of the chat log when new messages arrive
  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [chatLog, isLoading]);

  const sendMessage = async () => {
    if (message.trim() === '' || isLoading) return;

    const userMessage = message;
    setMessage('');
    setIsLoading(true);

    // Optimistically add user message to the UI immediately
    setChatLog((prevLog) => [...prevLog, { sender: 'You', text: userMessage }]);

    try {
      const response = await axios.post('https://helth-care-chatbot-using-fnn.onrender.com/chatbot/', { message: userMessage });
      setChatLog((prevLog) => [...prevLog, { sender: 'Bot', text: response.data.response }]);
    } catch (error) {
      setChatLog((prevLog) => [...prevLog, { sender: 'Bot', text: 'Error communicating with FastAPI.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='App'>
      <Stars />
      <div className='chat-container'>
        <div className='chat-header'>
          <img src={logo} alt="Chatbot Logo" className="Clogo" />
          <h2>AI Assistant</h2>
        </div>

        <div className='chat-log' ref={chatLogRef}>
          {chatLog.length === 0 ? (
            <div className="empty-state">
              <div className="welcome-card">
                <img src={logo} alt="Chatbot Logo" className="welcome-logo" />
                <p className="welcome-text">Hello! How can I help you today?</p>
                
                {/* Visual Medical Warning Badge */}
                <div className="medical-alert-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  <span><strong>Important:</strong> I am an AI, not a doctor. I may make mistakes. Please consult a healthcare professional for clinical advice.</span>
                </div>
              </div>
            </div>
          ) : (
            chatLog.map((chat, index) => (
              <div key={index} className={`chat-wrapper ${chat.sender === 'You' ? 'user-wrapper' : 'bot-wrapper'}`}>
                {chat.sender === 'Bot' && <img src={logo} alt="Bot Avatar" className="chat-avatar" />}
                <div className={`chat-message ${chat.sender === 'You' ? 'user' : 'bot'}`}>
                  {chat.text}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="chat-wrapper bot-wrapper">
              <img src={logo} alt="Bot Avatar" className="chat-avatar" />
              <div className="chat-message bot typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
        </div>

        <div className='chat-footer-container'>
          <div className='chat-input-container'>
            <input
              type='text'
              placeholder='Type your message...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
            />
            <button onClick={sendMessage} disabled={isLoading || !message.trim()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
          
          {/* Persistent Inline Footnote Disclaimer */}
          <p className="app-disclaimer-text">
            AI Assistant can make mistakes. Consider checking important medical information.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;