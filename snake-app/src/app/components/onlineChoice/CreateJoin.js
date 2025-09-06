import SnakeManager from "../SnakeManager";
import ChoiceScreen from "./ChoiceScreen";

import {useState} from 'react';

export default function CreateJoin({onSelectMode}) {
    const [decision, setDecision] = useState(null);
    const [gameId, setGameId] = useState("");
    return (<div id="decision-handler">
    {!decision && <ChoiceScreen onSelectMode={onSelectMode} onDecision={setDecision} setGameId={setGameId} gameId={gameId}/>}
    {decision === "create" && <SnakeManager onSelectMode={onSelectMode} gameId={gameId}/>}
    {decision === "join" && <SnakeManager onSelectMode={onSelectMode} gameId={gameId}/>}
    </div>)
}

