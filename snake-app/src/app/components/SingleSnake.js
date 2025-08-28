'use client'

import React, {useState} from 'react'
import { useSnakeGame } from '../Hooks/useSnakeGame.js';
import ScoreBoard from './ScoreBoard.js';
import GameCanvas from './GameCanvas.js';
import Controls from './Controls.js';

export default function SingleSnake({onSelectMode}) {
  const [tickSpeed, setTickSpeed] = useState(80);
  const {
    snake1,
    food1, 
    score,
    highscore,
    running,
    startGame,
    resetHighscore,
  } = useSnakeGame(tickSpeed);

  return (
    <div id="container">
      <ScoreBoard score={score} highscore={highscore}/>
      <GameCanvas snake1={snake1} snake2={null} food1={food1} food2={null} running={running}/>
      <Controls onRestart={startGame} onSetSpeed={setTickSpeed} onResetHighscore={resetHighscore} onSelectMode={onSelectMode}/>
    </div>);
}
