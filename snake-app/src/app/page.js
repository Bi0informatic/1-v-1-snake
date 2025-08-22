import GameBoard from "./components/gameboard";

export default function Home() {
  return (
    <div id="container">
      <div id="highscore-text" className="scoreText">0</div>
        <GameBoard/>
        <div id="score-text" className="scoreText">0</div>
        <button id="restart-button" className="button">Restart</button> 
        <button id="easy-button" className="difficulty button">Easy</button>
        <button id="normal-button" className="difficulty button">Normal</button>
        <button id="hard-button" className="difficulty button">Hard</button>
    </div>
  );
}
