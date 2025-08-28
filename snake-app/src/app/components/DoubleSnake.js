'use client'

import React, {useState} from 'react'
import ScoreBoard from './ScoreBoard.js';
import GameCanvas from './GameCanvas.js';
import Controls from './Controls.js';
import {useMultiGame} from '../Hooks/useMultiGame'

export default function DoubleSnake({onSelectMode}) {
    const [tickSpeed, setTickSpeed] = useState(80);
      const {
        snake1,
        snake2,
        food, 
        score,
        highscore,
        running,
        startGame,
        resetHighscore,
      } = useMultiGame(tickSpeed);
    
      return (
        <div id="container">
          <ScoreBoard score={score} highscore={highscore}/>
          <GameCanvas snake1={snake1} snake2={snake2} food={food} running={running}/>
          <Controls onRestart={startGame} onSetSpeed={setTickSpeed} onResetHighscore={resetHighscore} onSelectMode={onSelectMode}/>
        </div>);
}