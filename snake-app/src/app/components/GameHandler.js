import { useState } from "react"
import OpenScreen from "./OpenScreen";
import SnakeManager from "./SnakeManager";

export default function GameHandler() {
    const [mode, setMode] = useState(null);
    return (
        <div id="game-handler">
            {!mode && <OpenScreen onSelectMode={setMode}/>}
            {mode==="single" && <SnakeManager onSelectMode={setMode}/>}
            {mode==="localMulti" && <SnakeManager onSelectMode={setMode}/>}
        </div>
    );
}

