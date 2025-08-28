import { useState } from "react"
import OpenScreen from "./OpenScreen";
import SingleSnake from "./SingleSnake";
import DoubleSnake from "./DoubleSnake";

export default function GameHandler() {
    const [mode, setMode] = useState(null);
    return (
        <div id="game-handler">
            {!mode && <OpenScreen onSelectMode={setMode}/>}
            {mode==="single" && <SingleSnake onSelectMode={setMode}/>}
            {mode==="localMulti" && <DoubleSnake onSelectMode={setMode}/>}
        </div>
    );
}

