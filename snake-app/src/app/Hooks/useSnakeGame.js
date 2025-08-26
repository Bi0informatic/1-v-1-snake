'use client'

import React, {useState, useEffect, useCallback, useLayoutEffect} from 'react'

const unitSize = 25;
const canvasSize = 500;
const initialSnake = [
    {x:unitSize * 2, y: unitSize * 10},
    {x:unitSize, y: unitSize * 10},
    {x:0, y: unitSize * 10},
];

export function useSnakeGame(tickSpeed) {
    const [snake, setSnake] = useState(initialSnake);
    const [food, setFood] = useState({x: 0, y:0});
    const [dir, setDir] = useState({x: unitSize, y: 0});
    const [score, setScore] = useState(0);
    const [highscore, setHighscore] = useState(0);
    const [running, setRunning] = useState(false);

    const createFood = useCallback(()=>{
    const rand = (max) => {
        return Math.round((Math.random() * max) / unitSize) * unitSize;
    };
    let foodLocation = {x: rand(canvasSize - unitSize), y: rand(canvasSize - unitSize)};
    while (snake.some(seg => seg.x == foodLocation.x && seg.y == foodLocation.y)) {
        foodLocation = {x: rand(canvasSize - unitSize), y: rand(canvasSize - unitSize)};
    }
        setFood({x: foodLocation.x, y: foodLocation.y});
    }, [snake]);

    useLayoutEffect(()=>{
        setHighscore(window.localStorage.getItem("highscore"));
    },[]);

    const startGame = useCallback(()=>{
        setSnake(initialSnake);
        setDir({x: unitSize, y: 0});
        setScore(0);
        createFood();
        setRunning(true);
    }, [createFood]);

    const resetHighscore = useCallback(()=>{
        setHighscore(0);
        window.localStorage.setItem("highscore", 0);
    }, []);

    useEffect(()=>{
        const handleKey = (e) => {
            switch (e.code) {
                case "ArrowLeft" :
                    if (dir.x === 0) {
                        setDir({x: -unitSize, y: 0});
                    }
                    break;
                case "KeyA" :
                    if (dir.x === 0) {
                        setDir({x: -unitSize, y: 0});
                    }
                    break;
                case "ArrowUp":
                    if (dir.y === 0) {
                        setDir({x: 0, y: -unitSize});
                    }
                    break;
                case "KeyW":
                    if (dir.y === 0) {
                        setDir({x: 0, y: -unitSize});
                    }
                    break;
                case "ArrowRight":
                    if (dir.x === 0) {
                        setDir({x: unitSize, y: 0});
                    }
                    break;
                case "KeyD":
                    if (dir.x === 0) {
                        setDir({x: unitSize, y: 0});
                    }
                    break;
                case "ArrowDown":
                    if (dir.y === 0) {
                        setDir({x: 0, y: unitSize});
                    }
                    break;
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
            const head = {
                x: snake[0].x + dir.x,
                y: snake[0].y + dir.y
            }

            

            let ate = false;
            if (head.x === food.x && head.y === food.y) {
                setScore((s)=>{
                    const newS = s + 1;
                    if (newS > highscore) {
                        setHighscore(newS);
                        window.localStorage.setItem("highscore", newS);
                    }
                    return newS;
                });  
                console.log("score: " + score); 
                console.log("highscore: " + highscore);   
                ate = true;
                createFood();
            }

            const newSnake = [head, ...snake];
            if (!ate) newSnake.pop();
            setSnake(newSnake);
            

            const hitWall = head.x < 0 || head.y < 0 || head.x >= canvasSize || head.y >= canvasSize;
            const hitSelf = newSnake.slice(1).some(seg => seg.x === head.x && seg.y === head.y);

            if (hitWall || hitSelf) setRunning(false);
        }, tickSpeed)

        return () => clearTimeout(id);
    }, [snake, dir, running, tickSpeed, food, score, highscore, createFood]);

    return  {
        snake, 
        food, 
        score,
        highscore,
        running,
        startGame,
        setTickSpeed: ()=>{},
        resetHighscore,
        setRunning,
        setDir
    }
}