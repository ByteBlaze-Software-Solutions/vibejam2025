import { useState, useEffect } from 'react';
import '../styles/Loading.css';

const loadingQuotes = [
  "Calibrating weapon systems...",
  "Loading jump physics...",
  "Spawning health packs...",
  "Painting low-poly textures...",
  "Charging rocket launchers...",
  "Calculating air control physics...",
  "Optimizing strafe jumping...",
  "Preparing respawn points...",
  "Synchronizing server time...",
  "Polishing railgun accuracy..."
];

const Loading = () => {
  const [progress, setProgress] = useState(0);
  const [quote, setQuote] = useState(loadingQuotes[0]);
  
  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
      
      // Update loading quote
      if (Math.random() > 0.7) {
        const randomQuote = loadingQuotes[Math.floor(Math.random() * loadingQuotes.length)];
        setQuote(randomQuote);
      }
    }, 150);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="loading-screen">
      <div className="loading-container">
        <h2 className="loading-title">Loading Game</h2>
        
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        
        <div className="loading-quote">{quote}</div>
        
        <div className="loading-status">{progress}%</div>
      </div>
    </div>
  );
};

export default Loading; 