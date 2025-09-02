import { useState } from "react"
import OpenScreen from "./OpenScreen";
import SingleSnake from "./SingleSnake";
import DoubleSnake from "./DoubleSnake";
import SnakeManager from "./SnakeManager";

export default function GameHandler() {
    const [mode, setMode] = useState(null);
    return (
        <div id="game-handler">
            {!mode && <OpenScreen onSelectMode={setMode}/>}
            {mode==="single" && <SingleSnake onSelectMode={setMode}/>}
            {mode==="localMulti" && <DoubleSnake onSelectMode={setMode}/>}
            {mode==="onlineMulti" && <SnakeManager onSelectMode={setMode}/>}
        </div>
    );
}

