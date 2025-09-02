'use client'

import React, {useEffect, useState} from 'react'
import { useSnakeGame } from '../Hooks/useSnakeGame.js';
import ScoreBoard from './ScoreBoard.js';
import GameCanvas from './GameCanvas.js';
import Controls from './Controls.js';
import { useOnlineGame } from '../Hooks/useOnlineGame.js';

export default function OnlineSnake({onSelectMode, connectionManager, players}) {
  const player = players.get("localPlayer");
  const events = player.events;
  const gameState = player.gameState;
  const oppSnake = gameState.oppSnake;
  const food1GameState = gameState.food1;
  const food2GameState = gameState.food2;
  const scoreGameState = gameState.score;
  const [tickSpeed, setTickSpeed] = useState(80);
  const {
    snake1,
    food1,
    food2, 
    score,
    highscore,
    running,
    startGame,
    resetHighscore,
  } = useOnlineGame(tickSpeed, oppSnake, food1GameState, food2GameState);
  // sends running when running is changed :connectionManager must also be changed when adding emits
  useEffect(()=>{
    events.emit("running", running);
  }, [events, running]);

  useEffect(()=>{
    events.emit("oppSnake", oppSnake);
  }, [events, oppSnake]);

  return (
    <React.Fragment>
      <ScoreBoard score={score} highscore={highscore}/>
      <GameCanvas snake1={snake1} snake2={null} food1={food1} food2={food2} running={running}/>
      <Controls onRestart={startGame} onSetSpeed={setTickSpeed} onResetHighscore={resetHighscore} onSelectMode={onSelectMode} connectionManager={connectionManager}/>
    </React.Fragment>);
}
