'use client'

import React, {useState, useEffect, useCallback, useLayoutEffect} from 'react'

const unitSize = 25;
const canvasSize = 500;
const initialSnake = [
    {x:unitSize * 2, y: unitSize * 10},
    {x:unitSize, y: unitSize * 10},
    {x:0, y: unitSize * 10},
];

export function useOnlineGame(tickSpeed, oppSnake, food1GameState, food2GameState) {
    const [snake1, setSnake1] = useState(initialSnake);
    const [food1, setFood1] = useState(food1GameState);
    const [food2, setFood2] = useState(food2GameState);
    const [dir, setDir] = useState({x: unitSize, y: 0});
    
    const [score, setScore] = useState(0);
    const [highscore, setHighscore] = useState(0);
    const [running, setRunning] = useState(false);

    const createFood = useCallback(()=>{
        const location1 = setFoodLocation(setFood1, snake1, oppSnake);
        console.log("food1 is at ", location1);
        const location2 = setFoodLocation(setFood2, snake1, oppSnake); 
        console.log("food2 is at ", location2);
        }, [snake1, oppSnake]);
    useLayoutEffect(()=>{
        setHighscore(window.localStorage.getItem("highscore"));
    },[]);

    const startGame = useCallback(()=>{
        const restartButton = document.getElementById("restart-button");
        setSnake1(initialSnake);
        setDir({x: unitSize, y: 0});
        setScore(0);
        createFood();
        setRunning(true);
        if (restartButton.classList.contains("start")) {
            restartButton.classList.remove("start");
            restartButton.textContent = "Restart";
            restartButton.classList.add("restart");
        }
    }, [createFood]);

    const resetHighscore = useCallback(()=>{
        setHighscore(0);
        window.localStorage.setItem("highscore", 0);
    }, []);

    useEffect(()=>{
        const handleKey = (e) => {
            switch (e.code) {
                case "ArrowLeft" :
                case "KeyA" :
                    if (dir.x === 0) {
                        setDir({x: -unitSize, y: 0});
                    }
                    break;
                case "ArrowUp":
                case "KeyW":
                    if (dir.y === 0) {
                        setDir({x: 0, y: -unitSize});
                    }
                    break;
                case "ArrowRight":
                case "KeyD":
                    if (dir.x === 0) {
                        setDir({x: unitSize, y: 0});
                    }
                    break;
                case "ArrowDown":
                case "KeyS":
                    if (dir.y === 0) {
                        setDir({x: 0, y: unitSize});
                    }
                    break;
                case "space":
                    startGame();
                    break;
                default:
                    break;
            }
        }

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [dir, startGame]);

    useEffect(()=>{
        if (!running) return;

        const id = setTimeout(()=> {
            const head1 = {
                x: snake1[0].x + dir.x,
                y: snake1[0].y + dir.y
            }

            const hitWall = head1.x < 0 || head1.y < 0 || head1.x >= canvasSize || head1.y >= canvasSize;
            const hitSelf = snake1.slice(0).some(seg => seg.x === head1.x && seg.y === head1.y);

            if (hitWall || hitSelf) {
                setRunning(false)
                return;
            };

            let ate1 = false;
            if (head1.x === food1.x && head1.y === food1.y || head1.x === food2.x && head1.y === food2.y) {
                setScore((s)=>{
                    const newS = s + 1;
                    if (newS > highscore) {
                        setHighscore(newS);
                        window.localStorage.setItem("highscore", newS);
                    }
                    return newS;
                });  
                ate1 = true;
                createFood();
            }

            const newSnake1 = [head1, ...snake1];
            if (!ate1) newSnake1.pop();
            setSnake1(newSnake1);
            

            
        }, tickSpeed)

        return () => clearTimeout(id);
    }, [snake1, dir, running, tickSpeed, food1, food2, score, highscore, createFood]);

    return  {
        snake1, 
        food1,
        food2, 
        score,
        highscore,
        running,
        startGame,
        setTickSpeed: ()=>{},
        resetHighscore,
        setRunning
    }
}

function setFoodLocation(setFood, snake1, oppSnake) {
    const rand = (max) => {
            return Math.round((Math.random() * max) / unitSize) * unitSize;
        };
    let foodLocation = {x: rand(canvasSize - unitSize), y: rand(canvasSize - unitSize)};
    while (snake1.some(seg => seg.x == foodLocation.x && seg.y == foodLocation.y) && oppSnake.some(seg => seg.x == foodLocation.x && seg.y == foodLocation.y)) {
        foodLocation = {x: rand(canvasSize - unitSize), y: rand(canvasSize - unitSize)};
    }
    setFood({x: foodLocation.x, y: foodLocation.y});
    return {x: foodLocation.x, y: foodLocation.y};
}