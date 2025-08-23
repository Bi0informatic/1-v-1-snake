'use client'

import React, {useState} from 'react'
import { useSnakeGame } from './Hooks/useSnakeGame.js';
import ScoreBoard from "./components/ScoreBoard.js";
import Controls from "./components/Controls.js";
import GameCanvas from "./components/GameCanvas.js";

export default function App() {
  const [tickSpeed, setTickSpeed] = useState(90);
  const {
    snake,
    food, 
    score,
    highscore,
    running,
    startGame
  } = useSnakeGame(tickSpeed);

  return (
    <div id="container">
      <ScoreBoard score={score} highscore={highscore}/>
      <GameCanvas snake={snake} food={food} running={running}/>
      <Controls onRestart={startGame} onSetSpeed={setTickSpeed}/>
    </div>);
}
