import GameBoard from "./components/GameBoard.js";
import RestartButton from "./components/RestartButton.js";
import DifficultyButtons from "./components/DifficultyButtons.js";
import ScoreBoard from "./components/ScoreBoard.js";
import App from "./components/App.js";

export default function Home() {
  return (
    <div id="container">
      <App/>
      <ScoreBoard/>
      <GameBoard/>
      <RestartButton/>
      <DifficultyButtons/>
    </div>
  );
}
