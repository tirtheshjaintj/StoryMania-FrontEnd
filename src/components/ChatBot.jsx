import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { FaHistory } from "react-icons/fa";
const url = import.meta.env.VITE_BACKEND_URL;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [{ sender: 'AI', text: 'Hi, how can I help you today?' }];
  });

  const chatContainerRef = useRef(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = { sender: 'You', text: input };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput('');
      localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));

      try {
        const response = await axios.post(`${url}/groqBot`, { prompt: input });
        const botMessage = { sender: 'AI', text: response.data };
        const updatedMessagesWithBot = [...updatedMessages, botMessage];
        setMessages(updatedMessagesWithBot);
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessagesWithBot));
      } catch (error) {
        console.log(error);
        const errorMessage = { sender: 'AI', text: 'Sorry, an error occurred. Please try again later.' };
        const updatedMessagesWithError = [...updatedMessages, errorMessage];
        setMessages(updatedMessagesWithError);
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessagesWithError));
      }
    }
  };

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const clearChatHistory = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to clear the chat history?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, clear it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear chat messages from state and localStorage
        setMessages([{ sender: 'AI', text: 'Hi, how can I help you today?' }]);
        localStorage.removeItem('chatMessages');
        Swal.fire(
          'Cleared!',
          'Your chat history has been cleared.',
          'success'
        );
      }
    });
  };

  return (
    <div>
      {/* Chatbot Button */}
      <button
        onClick={toggleChatbot}
        className="fixed bottom-4 right-4 inline-flex items-center justify-center w-16 h-16 bg-black hover:bg-gray-700 rounded-full text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
        </svg>
      </button>

      {/* Chatbot UI */}
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : '100%' }}
        transition={{ duration: 0.5 }}
        className={`fixed bottom-0 right-0 w-full sm:w-[440px] h-[100vh] sm:h-[634px] bg-gray-900/50 backdrop-blur-3xl p-6 rounded-t-lg sm:rounded-lg border border-gray-300 shadow-lg z-50 ${isOpen ? 'block' : 'hidden'}`}
      >
        {/* Chatbot Header */}
        <div className="flex justify-between items-center pb-4 border-b">
        <div className='flex justify-center items-center'>
          <h2 className="font-semibold text-lg pr-2">Chatbot</h2>
            {/* Clear Chat History Button */}
        <button
          onClick={clearChatHistory}
        >
        <FaHistory className='text-xl'/>
        </button>
        </div>
          <button onClick={toggleChatbot} className="text-gray-600 hover:text-gray-900">
            &#10005;
          </button>
        </div>

        {/* Chat Messages */}
        <div
          ref={chatContainerRef}
          className="flex flex-col space-y-4 overflow-y-auto h-[calc(100vh-180px)] sm:h-[474px] pr-4"
        >
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'AI' ? 'justify-start' : 'justify-end'}`}>
              <div className={`flex items-center space-x-2 p-3 rounded-lg ${msg.sender === 'AI' ? 'backdrop-blur-3xl bg-gray-900/5' : 'backdrop-blur-3xl bg-gray-900/5'}`}>
                <div className="text-sm">
                  <span className="block font-bold">{msg.sender}</span>
                  
                  <pre className="w-full text-wrap">{msg.text}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Box */}
        <form onSubmit={handleSubmit} className="flex items-center mt-4 space-x-2">
          <input
            type="text"
            className="flex-grow p-2 rounded-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="Type your message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md"
          >
            Send
          </button>
        </form>

      
      </motion.div>
    </div>
  );
};

export default Chatbot;
