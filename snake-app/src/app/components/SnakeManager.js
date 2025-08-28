'use client'

import React, {useState} from 'react'
import { useSnakeGame } from '../Hooks/useSnakeGame.js';
import ScoreBoard from './ScoreBoard.js';
import GameCanvas from './GameCanvas.js';
import Controls from './Controls.js';
import OpenScreen from './OpenScreen.js';

export default function SnakeManager({onSelectMode}) {
  const [tickSpeed, setTickSpeed] = useState(80);
  const {
    snake,
    food, 
    score,
    highscore,
    running,
    startGame,
    resetHighscore,
  } = useSnakeGame(tickSpeed);

  return (
    <div id="container">
      <ScoreBoard score={score} highscore={highscore}/>
      <GameCanvas snake={snake} food={food} running={running}/>
      <Controls onRestart={startGame} onSetSpeed={setTickSpeed} onResetHighscore={resetHighscore} onSelectMode={onSelectMode}/>
    </div>);
}
