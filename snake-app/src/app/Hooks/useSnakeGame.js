'use client'

import React, {useState, useEffect, useCallback} from 'react'

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
    const [highscore, setHighscore] = useState(()=>{
        if (typeof window !== "undefined") {
            return parseInt(window.localStorage.getItem("highscore"), 10) || 0;
        } else {
            return 0;
        }
    })
    const [running, setRunning] = useState(false);

    const createFood = useCallback(()=>{
        const rand = (max) => Math.round((Math.random() * max) / unitSize) * unitSize;
        setFood({x: rand(canvasSize), y: (canvasSize)});
    }, []);

    const startGame = useCallback(()=>{
        setSnake(initialSnake);
        setDir({x: unitSize, y: 0});
        setScore(0);
        createFood();
        setRunning(true);
    }, [createFood]);

    useEffect(()=>{
        const handleKey = (e) => {
            switch (e.code) {
                case "ArrowLeft" :
                    if (dir.x === 0) {
                        setDir({x: -unitSize, y: 0});
                    }
                    break;
                case "ArrowUp":
                    if (dir.y === 0) {
                        setDir({x: 0, y: -unitSize});
                    }
                    break;
                case "ArrowRight":
                    if (dir.x === 0) {
                        setDir({x: unitSize, y: 0});
                    }
                    break;
                case "ArrowDown":
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
                setScore((s)=>s++);
                ate = true;
                createFood();
            }

            const newSnake = [head, ...snake];
            if (!ate) newSnake.pop();
            setSnake(newSnake);

            setHighscore((hs)=>{
                const updated = Math.max(hs, score + ate ? 1 : 0);
                window.localStorage.setItem("highscore", updated);
                return updated;
            });

            const hitWall = head.x < 0 || head.y < 0 || head.x >= canvasSize || head.y >= canvasSize;
            const hitSelf = newSnake.slice(1).some(seg => seg.x === head.x && seg.y === head.y);

            if (hitWall || hitSelf) setRunning(false);
        }, tickSpeed)

        return () => clearTimeout(id);
    }, [snake, dir, running, tickSpeed, food, score, createFood]);

    return  {
        snake, 
        food, 
        score,
        highscore,
        running,
        startGame,
        setTickSpeed: ()=>{},
        setRunning,
        setDir
    }
}