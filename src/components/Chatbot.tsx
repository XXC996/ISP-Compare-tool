import { useTranslation } from 'react-i18next';
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faTimes, faPaperPlane, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const Chatbot: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: "Hello! I'm your AI assistant. How can I help you compare internet or utility plans today?" }
  ]);
  
  const messagesEndRef = useRef(null);
  
  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsChatOpen(!isChatOpen);
    }
  };
  
  const minimizeChat = () => {
    setIsMinimized(true);
  };
  
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const sendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message to chat
    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      text: message
    };
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setMessage('');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(message);
      const newBotMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: botResponse
      };
      
      setMessages(prevMessages => [...prevMessages, newBotMessage]);
    }, 1000);
  };
  
  const generateBotResponse = (userMessage) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes('nbn') || lowerCaseMessage.includes('internet') || lowerCaseMessage.includes('broadband')) {
      return "NBN plans typically range from $60 to $120 per month depending on the speed tier. The most popular option is NBN 50, which is suitable for most households. Would you like to see our recommended NBN plans?";
    } else if (lowerCaseMessage.includes('5g') || lowerCaseMessage.includes('mobile broadband')) {
      return "5G home internet is a great alternative to NBN, especially if you're in an area with good 5G coverage. Prices typically start from $70/month with speeds comparable to NBN 100.";
    } else if (lowerCaseMessage.includes('best provider') || lowerCaseMessage.includes('recommended')) {
      return "Based on our customer reviews, Aussie Broadband has the highest satisfaction ratings, followed by Superloop and Mate. Would you like to see their current offers?";
    } else if (lowerCaseMessage.includes('contract') || lowerCaseMessage.includes('lock in')) {
      return "Many providers now offer no lock-in contracts, giving you flexibility to change. However, you might get better deals with 12 or 24-month contracts, often including free setup or modem.";
    } else if (lowerCaseMessage.includes('compare') || lowerCaseMessage.includes('switch')) {
      return "To compare your current plan, use our Competitor Comparison Tool. Just enter your current provider, plan type, and monthly cost, and we'll show you potentially better deals.";
    } else if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi') || lowerCaseMessage.includes('hey')) {
      return "Hello! How can I help you today? I can assist with finding the right internet plan, comparing providers, or explaining technical terms.";
    } else {
      return "I'm not sure I understand your question. Could you rephrase it or ask about specific internet plans, providers, or our comparison tools?";
    }
  };

  return (
    <div className="ai-chatbot">
      {!isChatOpen && !isMinimized && (
        <button className="chatbot-toggle" onClick={toggleChat}>
          <FontAwesomeIcon icon={faComments} />
          <span>Need Help?</span>
        </button>
      )}
      
      {isMinimized && (
        <button className="chatbot-minimized" onClick={toggleChat}>
          <FontAwesomeIcon icon={faChevronUp} />
          <span>AI Assistant</span>
        </button>
      )}
      
      <div className={`chatbot-container ${!isChatOpen && !isMinimized ? 'hidden' : ''} ${isMinimized ? 'minimized' : ''}`}>
        <div className="chatbot-header">
          <h4>AI Assistant</h4>
          <button className="close-chat" onClick={minimizeChat}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <div className="chatbot-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.type}`}>
              <p>{msg.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <form className="chatbot-input" onSubmit={sendMessage}>
          <input 
            type="text" 
            placeholder="Type your question..." 
            value={message}
            onChange={handleMessageChange}
          />
          <button type="submit">
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot; 