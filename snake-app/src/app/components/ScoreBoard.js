import React from 'react';

export default function ScoreBoard({score, highscore}) {
    return (<div id="score-board">
        <div id="highscore-text" className="scoreText">{highscore}</div>
        <div id="score-text" className="scoreText">{score}</div>
    </div>);
}