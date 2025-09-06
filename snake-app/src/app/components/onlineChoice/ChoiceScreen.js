import "./choice.css"

export default function ChoiceScreen({onSelectMode, onDecision, setGameId, gameId}) {
    const handleInput = (event) => {
        setGameId(event.target.value);
    }

    return (<div id="choice-screen">
    <button id="create-button" className="button" onClick={()=>{onDecision("create")}}>Create</button>
    <label htmlFor="id-input">Game Code: </label>
    <input id="id-input" type="text" value={gameId} onChange={handleInput}></input>
    <button id="join-button" className="button" onClick={()=>{onDecision("join");}}>Join</button>
    <button id="menu-button" className="button" onClick={()=>{onSelectMode(null);}}>Menu</button> 
    </div>)
}