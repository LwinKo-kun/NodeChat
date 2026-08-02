import React from 'react';

export default function Dashboard({ user }) {
  return (
    <div style={{ padding: 24 }}>
      <h1>Welcome, {user.name}</h1>
      <p>This is your dashboard. Use the sidebar to open chats.</p>
    </div>
  );
}
