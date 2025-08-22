import GameBoard from "./components/GameBoard.js";
import Buttons from "./components/Buttons.js";

export default function Home() {
  return (
    <div id="container">
      <div id="highscore-text" className="scoreText">0</div>
        <GameBoard/>
        <div id="score-text" className="scoreText">0</div>
        <Buttons/>
    </div>
  );
}
