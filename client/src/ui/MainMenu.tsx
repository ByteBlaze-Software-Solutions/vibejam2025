import { useState } from 'react';
import '../styles/MainMenu.css';

interface MainMenuProps {
  onStart: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart }) => {
  const [showSettings, setShowSettings] = useState(false);
  
  return (
    <div className="main-menu ui-layer">
      <div className="menu-container ui-control">
        <div className="game-title">
          <h1>VibeJam 2025</h1>
          <h2>High-Movement FPS</h2>
        </div>
        
        {!showSettings ? (
          <div className="menu-buttons">
            <button className="primary" onClick={onStart}>Play Now</button>
            <button className="secondary" onClick={() => setShowSettings(true)}>Settings</button>
            <button>Credits</button>
          </div>
        ) : (
          <div className="settings-panel">
            <h3>Settings</h3>
            <div className="setting-group">
              <label>
                Mouse Sensitivity
                <input type="range" min="0.1" max="5" step="0.1" defaultValue="1" />
              </label>
            </div>
            <div className="setting-group">
              <label>
                Sound Volume
                <input type="range" min="0" max="1" step="0.01" defaultValue="0.5" />
              </label>
            </div>
            <div className="setting-group">
              <label>
                Graphics Quality
                <select defaultValue="medium">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
            </div>
            <button onClick={() => setShowSettings(false)}>Back</button>
          </div>
        )}
        
        <div className="version-info">
          <p>Alpha Version 0.1.0</p>
        </div>
      </div>
    </div>
  );
};

export default MainMenu; 