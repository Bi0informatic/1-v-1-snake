export default function Controls({onRestart, onSetSpeed}) {
    return (<div id="control-buttons">
        <button id="restart-button" className="button" onclick={onRestart}>Restart</button>
        <button id="easy-button" className="difficulty button" onclick={()=>{onSetSpeed(80); onRestart();}}>Easy</button>
        <button id="normal-button" className="difficulty button" onclick={()=>{onSetSpeed(90); onRestart();}}>Normal</button>
        <button id="hard-button" className="difficulty button" onclick={()=>{onSetSpeed(100); onRestart();}}>Hard</button>
    </div>)
}