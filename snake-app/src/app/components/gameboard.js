'use client'

import { useState } from "react";


export default function GameBoard() {
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    return (<div id="game-board">
        <div id="highscore-text" className="scoreText">{highScore}</div>
        <canvas id="game-canvas" width="500" height="500">Your browser does not support the HTML5 canvas tag.</canvas>
        <div id="score-text" className="scoreText">{score}</div>
    </div>)
}

function message() {
    console.log("hi");
}
message()
message()
message()
message()