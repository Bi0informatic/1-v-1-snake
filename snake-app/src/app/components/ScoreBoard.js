'use client'

import { useState } from "react";

export default function ScoreBoard() {
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    return (<div id="score-board">
        <div id="highscore-text" className="scoreText">{highScore}</div>
        <div id="score-text" className="scoreText">{score}</div>
    </div>)
}