import React, { useState } from 'react';
import './App.css';
import ChatContainer from './components/ChatContainer';
import { Message } from './types';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Chat Tool</h1>
      </header>
      <main>
        <ChatContainer messages={messages} setMessages={setMessages} />
      </main>
    </div>
  );
}

export default App;