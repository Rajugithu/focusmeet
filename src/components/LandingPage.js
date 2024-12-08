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
    }, 800); // Allow animation time
  };

  return (
    <div className="landing-container">
      <div className={`content ${moveUp ? 'move-up' : ''}`}>
        {/* <h1>Welcome to FocusMeet</h1> */}
        <div className="button-group">
          <button className="btn" onClick={() => handleTransition('/signup')}>
            Login as a Teacher
          </button>
          <button className="btn" onClick={() => handleTransition('/signup')}>
            Login as a Student
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;