import React, { useEffect, useRef } from 'react';
import '../styles/SimpleGame.css';
import { Engine } from './core/Engine';

const RefactoredGame: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Create and initialize the game engine
    const engine = new Engine(mountRef.current);
    engineRef.current = engine;
    
    // Start the game loop
    engine.start();
    
    // Cleanup when component unmounts
    return () => {
      if (engineRef.current) {
        engineRef.current.dispose();
        engineRef.current = null;
      }
    };
  }, []);
  
  return (
    <div className="simple-game-container">
      <div ref={mountRef} style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }} />
      <div className="game-instructions">
        Click to look around. WASD to move. Space to jump.
      </div>
    </div>
  );
};

export default RefactoredGame; 