import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Style/LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const [moveUp, setMoveUp] = useState(false);

  const handleTransition = (path) => {
    setMoveUp(true); // Trigger animation

    setTimeout(() => {
      navigate(path);
    }, 800); 
  };

  return (
    <div className="landing-container">
      <div className={`content ${moveUp ? 'move-up' : ''}`}>
        <div className="button-group">
          <button className="btn" onClick={() => handleTransition('/about')}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
