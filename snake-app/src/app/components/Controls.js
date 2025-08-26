import React from 'react';

export default function Controls({onRestart, onSetSpeed, onResetHighscore}) {
    return (<div id="control-buttons">
        <button id="restart-button" className="button" onClick={onRestart}>Restart</button>
        <button id="easy-button" className="difficulty button" onClick={()=>{onSetSpeed(100); onRestart();}}>Easy</button>
        <button id="normal-button" className="difficulty button" onClick={()=>{onSetSpeed(80); onRestart();}}>Normal</button>
        <button id="hard-button" className="difficulty button" onClick={()=>{onSetSpeed(60); onRestart();}}>Hard</button>
        <button id="reset-highscore-button" className="button" onClick={onResetHighscore}>Reset Highscore</button>
    </div>)
}