import ScoreBoard from "./components/ScoreBoard.js";
import Controls from "./components/Controls.js";
import GameCanvas from "./components/GameCanvas.js";

export default function App() {
  return (
    <div id="container">
      <ScoreBoard/>
      <GameCanvas/>
      <Controls/>
    </div>);
}
