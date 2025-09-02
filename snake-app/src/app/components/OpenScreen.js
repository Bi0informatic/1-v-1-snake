export default function OpenScreen({onSelectMode}) {
    return <>
        <div id="open-screen">
            <h1 id="open-header">Snake Game</h1>
            <button id="single-player" className="open-button button" onClick={()=>{onSelectMode("single");}}>Single Player</button>
            <button id="multiplayer" className="open-button button" onClick={()=>{onSelectMode("localMulti");}}>Local Multiplayer</button>
            <button id="online-multiplayer" className="open-button button" onClick={()=>{onSelectMode("onlineMulti");}}>Online Multiplayer</button>
        </div>
    </>
}