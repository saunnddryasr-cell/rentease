// src/components/support/SupportChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FaComments, 
  FaTimes, 
  FaPaperPlane, 
  FaUser, 
  FaHeadset,
  FaCircle,
  FaImage,
  FaFile,
  FaSmile,
  FaCheck,
  FaCheckDouble,
  FaClock,
  FaPhone,
  FaVideo,
  FaInfoCircle,
  FaMinus,
  FaPlus,
  FaRobot,
  FaUserCheck
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const SupportChat = () => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [chatStatus, setChatStatus] = useState('offline'); // online, offline, away, busy
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle unread count when chat is closed
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const unread = messages.filter(m => !m.isRead && m.sender === 'support').length;
      setUnreadCount(unread);
    }
  }, [messages, isOpen]);

  // Simulate connection
  useEffect(() => {
    if (isOpen) {
      connectToChat();
    }
    return () => disconnectFromChat();
  }, [isOpen]);

  const connectToChat = () => {
    setIsConnected(true);
    setChatStatus('online');
    // Simulate welcome message
    setTimeout(() => {
      addMessage({
        id: Date.now(),
        sender: 'support',
        text: 'Hello! 👋 Welcome to RentEase Support. How can I help you today?',
        timestamp: new Date().toISOString(),
        isRead: false
      });
    }, 500);
  };

  const disconnectFromChat = () => {
    setIsConnected(false);
    setChatStatus('offline');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
    if (message.sender === 'support' && !isOpen) {
      setUnreadCount(prev => prev + 1);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && uploadingFiles.length === 0) return;

    const message = {
      id: Date.now(),
      sender: 'user',
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: true,
      attachments: uploadingFiles.map(f => f.name)
    };

    addMessage(message);
    setNewMessage('');
    setUploadingFiles([]);
    setIsTyping(true);

    // Simulate support response
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "Thank you for your message. Let me look into that for you.",
        "I understand your concern. Let me help you with that.",
        "That's a great question! Here's what you need to know...",
        "I'll check that for you right away. Please hold on.",
        "Thank you for reaching out. I'm here to help!",
        "I appreciate your patience. Let me get that information for you.",
        "That's an excellent question. Let me explain...",
        "I've noted your concern. Our team will look into this."
      ];
      
      addMessage({
        id: Date.now() + 1,
        sender: 'support',
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
        isRead: false
      });
      
      // Sometimes add a follow-up
      if (Math.random() > 0.5) {
        setTimeout(() => {
          addMessage({
            id: Date.now() + 2,
            sender: 'support',
            text: "Is there anything else I can help you with?",
            timestamp: new Date().toISOString(),
            isRead: false
          });
        }, 2000);
      }
    }, 1500);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(f => f.size <= 5 * 1024 * 1024); // 5MB limit
    
    if (validFiles.length !== files.length) {
      toast.error('Some files exceed 5MB limit');
    }
    
    setUploadingFiles(prev => [...prev, ...validFiles]);
    toast.success(`${validFiles.length} file(s) uploaded`);
  };

  const removeFile = (index) => {
    setUploadingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  const getStatusColor = () => {
    switch(chatStatus) {
      case 'online': return 'text-green-500';
      case 'away': return 'text-yellow-500';
      case 'busy': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    switch(chatStatus) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'busy': return 'Busy';
      default: return 'Offline';
    }
  };

  const emojis = ['😊', '😂', '❤️', '😍', '👍', '👏', '🎉', '🔥', '💪', '🤝', '🙏', '😅', '🥳', '✨', '💯'];

  // Chat bubble component
  const MessageBubble = ({ message, isOwn }) => {
    const isSupport = message.sender === 'support';
    
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
        {!isOwn && (
          <div className="flex-shrink-0 mr-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
              isSupport ? 'bg-primary-600' : 'bg-gray-400'
            }`}>
              {isSupport ? <FaHeadset size={14} /> : <FaUser size={14} />}
            </div>
          </div>
        )}
        <div className={`max-w-[70%] ${isOwn ? 'order-1' : ''}`}>
          <div className={`rounded-2xl px-4 py-2 ${
            isOwn 
              ? 'bg-primary-600 text-white rounded-br-none' 
              : 'bg-gray-100 text-gray-800 rounded-bl-none'
          }`}>
            {message.text && (
              <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
            )}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {message.attachments.map((file, index) => (
                  <span key={index} className="text-xs bg-black bg-opacity-10 px-2 py-1 rounded flex items-center gap-1">
                    <FaFile size={10} />
                    {file}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className={`flex items-center gap-1 mt-1 text-xs text-gray-400 ${isOwn ? 'justify-end' : ''}`}>
            <span>{formatTime(message.timestamp)}</span>
            {isOwn && (
              <span>
                {message.isRead ? (
                  <FaCheckDouble className="text-primary-500" />
                ) : (
                  <FaCheck className="text-gray-400" />
                )}
              </span>
            )}
          </div>
        </div>
        {isOwn && (
          <div className="flex-shrink-0 ml-2 order-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm">
              <FaUser size={14} />
            </div>
          </div>
        )}
      </div>
    );
  };

  // Date separator
  const DateSeparator = ({ date }) => (
    <div className="flex items-center my-4">
      <div className="flex-1 border-t border-gray-200"></div>
      <span className="px-3 text-xs text-gray-400 bg-white">{date}</span>
      <div className="flex-1 border-t border-gray-200"></div>
    </div>
  );

  // Group messages by date
  const getGroupedMessages = () => {
    const grouped = {};
    messages.forEach(message => {
      const date = formatDate(message.timestamp);
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(message);
    });
    return grouped;
  };

  // Chat Button (Floating)
  const ChatButton = () => (
    <button
      onClick={() => setIsOpen(true)}
      className="relative bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-all hover:scale-105"
    >
      <FaComments size={24} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          {unreadCount}
        </span>
      )}
    </button>
  );

  // Chat Window
  const ChatWindow = () => {
    const groupedMessages = getGroupedMessages();
    const messageKeys = Object.keys(groupedMessages);

    return (
      <div className={`
        fixed bottom-20 right-4 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 
        transition-all duration-300 z-50
        ${isMinimized ? 'h-16' : 'h-[500px]'}
        ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
      `}>
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary-600 text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <FaHeadset size={20} />
              </div>
              <FaCircle className={`absolute -bottom-0.5 -right-0.5 ${getStatusColor()} text-xs`} />
            </div>
            <div>
              <h3 className="font-semibold">Support Team</h3>
              <div className="flex items-center gap-1 text-xs text-primary-100">
                <FaCircle className={`${getStatusColor()} text-[8px]`} />
                <span>{getStatusText()}</span>
                <span className="mx-1">•</span>
                <span>Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            >
              {isMinimized ? <FaPlus size={16} /> : <FaMinus size={16} />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            >
              <FaTimes size={16} />
            </button>
          </div>
        </div>

        {/* Chat Body */}
        {!isMinimized && (
          <>
            {/* Messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 h-[380px]">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <FaComments size={40} className="mb-2 opacity-20" />
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs">Start a conversation with our support team</p>
                </div>
              ) : (
                <>
                  {messageKeys.map((date) => (
                    <React.Fragment key={date}>
                      <DateSeparator date={date} />
                      {groupedMessages[date].map((message) => (
                        <MessageBubble 
                          key={message.id} 
                          message={message} 
                          isOwn={message.sender === 'user'} 
                        />
                      ))}
                    </React.Fragment>
                  ))}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex items-start mb-3">
                      <div className="flex-shrink-0 mr-2">
                        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                          <FaHeadset size={14} />
                        </div>
                      </div>
                      <div className="bg-gray-100 rounded-2xl px-4 py-3 rounded-bl-none">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* File Upload Previews */}
            {uploadingFiles.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {uploadingFiles.map((file, index) => (
                    <span key={index} className="inline-flex items-center gap-1 bg-gray-100 text-xs px-2 py-1 rounded">
                      <FaFile size={10} />
                      {file.name}
                      <button
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <FaTimes size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Input */}
            <div className="border-t border-gray-200 p-3">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm min-h-[40px] max-h-[100px]"
                    rows="1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <FaSmile size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <FaImage size={18} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() && uploadingFiles.length === 0}
                    className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaPaperPlane size={18} />
                  </button>
                </div>
              </form>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-20 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-48">
                  <div className="grid grid-cols-6 gap-1">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setNewMessage(prev => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="p-1 hover:bg-gray-100 rounded text-lg transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  // If user is not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            toast.error('Please login to chat with support');
            window.location.href = '/login';
          }}
          className="bg-gray-400 text-white p-4 rounded-full shadow-lg hover:bg-gray-500 transition-all"
        >
          <FaComments size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <ChatWindow />
      ) : (
        <ChatButton />
      )}
    </div>
  );
};

export default SupportChat;