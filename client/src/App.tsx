import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import SimpleGame from './game/SimpleGame';
import './styles/App.css';

// Create socket connection
const socket = io('http://localhost:3001');

const App: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [showGame, setShowGame] = useState(false);

  useEffect(() => {
    // Connect to the server
    socket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    // Listen for welcome message
    socket.on('welcome', (data) => {
      console.log('Received welcome message:', data);
      setMessage(data.message);
    });

    // Disconnect event
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    // Cleanup
    return () => {
      socket.off('connect');
      socket.off('welcome');
      socket.off('disconnect');
    };
  }, []);

  const startGame = () => {
    console.log('Starting game...');
    setShowGame(true);
  };

  const exitGame = () => {
    console.log('Exiting game...');
    setShowGame(false);
  };

  // Show game if active
  if (showGame) {
    return (
      <div className="game-wrapper">
        <SimpleGame />
        <button className="exit-button" onClick={exitGame}>Exit Game</button>
      </div>
    );
  }

  // Otherwise show menu
  return (
    <div className="app-container">
      <h1>VibeJam 2025</h1>
      <p>Browser FPS Game</p>
      
      <div className="connection-status">
        Status: {connected ? 'Connected' : 'Disconnected'} 
      </div>
      
      {message && (
        <div className="server-message">
          Server says: {message}
        </div>
      )}
      
      <div className="menu-buttons">
        <button className="main-button" onClick={startGame}>Play Now</button>
        <button className="secondary-button">Settings</button>
        <button className="secondary-button">Credits</button>
      </div>
    </div>
  );
};

export default App; 