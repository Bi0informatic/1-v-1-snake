export default function OpenScreen({onHide, localMultiplayer}) {
    return <>
        <div id="open-screen">
            <h1 id="open-header">Snake Game</h1>
            <button id="single-player" className="open-button button" onClick={onHide}>Single Player</button>
            <button id="multiplayer" className="open-button button" onClick={()=>{onHide(); localMultiplayer();}}>Multiplayer</button>
        </div>
    </>
}