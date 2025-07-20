import React, { useState, useEffect } from "react";
import "./App.css";
import Board from "./component/Board";

const emojiMap = {
  default: "🙂",
  happy: "😄",
  love: "😍",
  cool: "😎",
  thinker: "🤔",
  party: "🥳",
  tired: "😴",
  angry: "😠",
};

// Simple function to choose emoji based on name content or length
function getEmojiForName(name) {
  const lower = name.toLowerCase();
  if (!name) return emojiMap.default;
  if (lower.includes("love") || lower.includes("heart")) return emojiMap.love;
  if (lower.includes("fun") || lower.includes("party")) return emojiMap.party;
  if (lower.includes("cool") || lower.includes("coolguy")) return emojiMap.cool;
  if (lower.includes("sleep")) return emojiMap.tired;
  if (lower.includes("angry") || lower.includes("mad")) return emojiMap.angry;
  if (lower.length <= 3) return emojiMap.thinker;
  if (lower.length > 10) return emojiMap.happy;
  return emojiMap.default;
}

function App() {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(emojiMap.default);
  const [bgPosition, setBgPosition] = useState({ x: 50, y: 50 });
  const [hasStarted, setHasStarted] = useState(false);

  const handleStart = () => {
    if (name.trim()) {
      setHasStarted(true);
    }
  };

  useEffect(() => {
    setEmoji(getEmojiForName(name));
  }, [name]);

  // Mouse move handler to update background position
  const handleMouseMove = (e) => {
    // Calculate percentage position of cursor on screen (0 to 100)
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    setBgPosition({ x, y });
  };
  if (!hasStarted) {
    return (
      <div
        className="app-container"
        onMouseMove={handleMouseMove}
        style={{
          backgroundPosition: `${bgPosition.x}% ${bgPosition.y}%`,
        }}
      >
        <div className="welcome-box" tabIndex={0}>
          <h1>Welcome to The Memory Game!!</h1>
          <label htmlFor="playerName" className="player-label">
            Player Name:
          </label>
          <input
            type="text"
            name="playerName"
            id="playerName"
            className="player-input"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleStart();
            }}
            autoComplete="off"
            autoFocus
          />
          <br></br>
          <button
            onClick={handleStart}
            disabled={!name.trim()}
            style={{ marginTop: "1rem" }}
          >
            Start
          </button>
          <div className="emoji-display" aria-label="User emoji">
            {emoji}
          </div>
        </div>
      </div>
    );
  }
  return <Board playerName={name} />;
}

export default App;
