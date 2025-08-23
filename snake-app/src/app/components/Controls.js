import React from 'react';

export default function Controls({onRestart, onSetSpeed}) {
    return (<div id="control-buttons">
        <button id="restart-button" className="button" onClick={onRestart}>Restart</button>
        <button id="easy-button" className="difficulty button" onClick={()=>{onSetSpeed(100); onRestart();}}>Easy</button>
        <button id="normal-button" className="difficulty button" onClick={()=>{onSetSpeed(90); onRestart();}}>Normal</button>
        <button id="hard-button" className="difficulty button" onClick={()=>{onSetSpeed(80); onRestart();}}>Hard</button>
    </div>)
}