import RestartButton from "./components/RestartButton.js";
import DifficultyButtons from "./components/DifficultyButtons.js";
import ScoreBoard from "./components/ScoreBoard.js";

export default function Home() {
  return (
    <div id="container">
      <ScoreBoard/>
      <canvas id="game-canvas" width="500" height="500">Your browser does not support the HTML5 canvas tag.</canvas>
      <RestartButton/>
      <DifficultyButtons/>
    </div>);
}
