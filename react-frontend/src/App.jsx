import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

const API_URL = 'http://127.0.0.1:8000/api';

export default function App() {
  // Check localStorage session on initial load
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('chat_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [authView, setAuthView] = useState('login'); // 'login' or 'register'

  // Dashboard States
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeFriend, setActiveFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchFriends();
    }
  }, [user]);

  useEffect(() => {
    if (user && activeFriend) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [activeFriend]);

  const handleLogout = () => {
    localStorage.removeItem('chat_user');
    setUser(null);
    setActiveFriend(null);
  };

  const fetchFriends = async () => {
    try {
      const res = await fetch(`${API_URL}/friends/${user.id}`);
      const data = await res.json();
      setFriends(data);
    } catch (err) {
      console.error('Failed to fetch friends', err);
    }
  };

  const searchUsers = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/users/search?q=${query}&user_id=${user.id}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  const addFriend = async (friendId) => {
    try {
      const res = await fetch(`${API_URL}/friends/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, friend_id: friendId }),
      });
      if (res.ok) {
        fetchFriends();
        setSearchResults([]);
        setSearchQuery('');
      }
    } catch (err) {
      console.error('Failed to add friend', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/messages/fetch?user_id=${user.id}&friend_id=${activeFriend.id}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await fetch(`${API_URL}/messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: user.id,
          receiver_id: activeFriend.id,
          message: newMessage,
        }),
      });
      if (res.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  // --- REDIRECTION BASED ON SESSION ---
  if (!user) {
    return authView === 'login' ? (
      <Login onLoginSuccess={(userData) => setUser(userData)} switchToRegister={() => setAuthView('register')} />
    ) : (
      <Register switchToLogin={() => setAuthView('login')} />
    );
  }

  // --- CHAT DASHBOARD (Logged In View) ---
  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="user-profile">
          <h3>{user.name}</h3>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search users to add..."
            value={searchQuery}
            onChange={searchUsers}
          />
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((u) => (
                <div key={u.id} className="search-item">
                  <span>{u.name}</span>
                  <button onClick={() => addFriend(u.id)}>Add</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="friend-list">
          <h4>Your Friends</h4>
          {friends.length === 0 ? (
            <p className="no-friends">No friends added yet.</p>
          ) : (
            friends.map((f) => (
              <div
                key={f.id}
                className={`friend-item ${activeFriend?.id === f.id ? 'active' : ''}`}
                onClick={() => setActiveFriend(f)}
              >
                {f.name}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="chat-area">
        {activeFriend ? (
          <>
            <div className="chat-header">
              <h3>{activeFriend.name}</h3>
            </div>
            <div className="messages-box">
              {messages.map((m, index) => (
                <div
                  key={index}
                  className={`message-bubble ${m.sender_id === user.id ? 'sent' : 'received'}`}
                >
                  {m.message}
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="chat-input-box">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <h3>Select a friend from the sidebar to start chatting</h3>
          </div>
        )}
      </div>
    </div>
  );
}