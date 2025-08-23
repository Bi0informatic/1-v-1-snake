import ScoreBoard from "./components/ScoreBoard.js";
import Controls from "./components/Controls.js";

export default function GameBoard() {
  return (
    <div id="container">
      <ScoreBoard/>
      <canvas id="game-canvas" width="500" height="500">Your browser does not support the HTML5 canvas tag.</canvas>
      <Controls/>
    </div>);
}
