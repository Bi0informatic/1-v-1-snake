import React from 'react'

export default function ScoreBoard({score, highScore}) {
    return (<div id="score-board">
        <div id="highscore-text" className="scoreText">{highScore}</div>
        <div id="score-text" className="scoreText">{score}</div>
    </div>)
}