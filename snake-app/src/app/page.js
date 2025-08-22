import GameBoard from "./components/GameBoard.js";
import RestartButton from "./components/RestartButton.js";
import DifficultyButtons from "./components/DifficultyButtons.js";

export default function Home() {
  return (
    <div id="container">
        <GameBoard/>
        <RestartButton/>
        <DifficultyButtons/>
    </div>
  );
}
