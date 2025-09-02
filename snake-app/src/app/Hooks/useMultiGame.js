'use client'

import React, {useState, useEffect, useCallback, useLayoutEffect} from 'react'

const unitSize = 25;
const canvasSize = 500;
const initialSnake1 = [
    {x:unitSize * 2, y: unitSize * 10},
    {x:unitSize, y: unitSize * 10},
    {x:0, y: unitSize * 10},
];
const initialSnake2 = [
    {x:unitSize * 17, y: unitSize * 10},
    {x:unitSize * 18, y: unitSize * 10},
    {x:unitSize * 19, y: unitSize * 10},
];

export function useMultiGame(tickSpeed) {
    const [snake1, setSnake1] = useState(initialSnake1);
    const [snake2, setSnake2] = useState(initialSnake2);
    const [food1, setFood1] = useState({x: 0, y: 0});
    const [food2, setFood2] = useState ({x: 0, y: 0});
    const [dir1, setDir1] = useState({x: unitSize, y: 0});
    const [dir2, setDir2] = useState({x: -unitSize, y: 0});
    const [score, setScore] = useState(0);
    const [highscore, setHighscore] = useState(0);
    const [running, setRunning] = useState(false);

    const createFood = useCallback(()=>{
        setFoodLocation(setFood1, snake1, snake2);
        setFoodLocation(setFood2, snake1, snake2) 
        }, [snake1, snake2]);

    useLayoutEffect(()=>{
        setHighscore(window.localStorage.getItem("highscore"));
    },[]);

    const startGame = useCallback(()=>{
        const restartButton = document.getElementById("restart-button");
        setSnake1(initialSnake1);
        setSnake2(initialSnake2);
        setDir1({x: unitSize, y: 0});
        setDir2({x: -unitSize, y: 0});
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
    // assign snake1 controls
    useEffect(()=>{
        const handleKey1 = (e) => {
            changeDirection(e, "KeyA", "KeyW", "KeyD", "KeyS", dir1, setDir1);
        }

        window.addEventListener("keydown", handleKey1);
        return () => window.removeEventListener("keydown", handleKey1);
    }, [dir1, startGame]);
    // assign snake2 controls
    useEffect(()=>{
        const handleKey2 = (e) => {
            changeDirection(e, "ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown", dir2, setDir2);
        }

        window.addEventListener("keydown", handleKey2);
        return () => window.removeEventListener("keydown", handleKey2);
    }, [dir2, startGame]);

    useEffect(()=>{
        if (!running) return;

        const id = setTimeout(()=> {
            const head1 = {
                x: snake1[0].x + dir1.x,
                y: snake1[0].y + dir1.y
            }
            const head2 = {
                x: snake2[0].x + dir2.x,
                y: snake2[0].y + dir2.y
            }
            
            const hitWall1 = head1.x < 0 || head1.y < 0 || head1.x >= canvasSize || head1.y >= canvasSize;
            const hitSelf1 = snake1.slice(1).some(seg => seg.x === head1.x && seg.y === head1.y);

            if (hitWall1 || hitSelf1) {
                setRunning(false);
                return;
            };

            const hitWall2 = head2.x < 0 || head2.y < 0 || head2.x >= canvasSize || head2.y >= canvasSize;
            const hitSelf2 = snake2.slice(1).some(seg => seg.x === head2.x && seg.y === head2.y);

            if (hitWall2 || hitSelf2) {
                setRunning(false);
                return;
            };

            const hitOther1 = snake2.some(seg2=>head1.x === seg2.x && head1.y === seg2.y);
            const hitOther2 = snake1.some(seg1=>head2.x === seg1.x && head2.y === seg1.y);

            if (hitOther1 || hitOther2) {
                setRunning(false);
                return;
            };

            let ate1 = false;
            let ate2 = false;
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

            if (head2.x === food1.x && head2.y === food1.y || head2.x === food2.x && head2.y === food2.y) {  
                ate2 = true;
                createFood();
            }

            const newSnake1 = [head1, ...snake1];
            if (!ate1) newSnake1.pop();
            setSnake1(newSnake1);

            const newSnake2 = [head2, ...snake2];
            if (!ate2) newSnake2.pop();
            setSnake2(newSnake2);
            

        }, tickSpeed)

        return () => clearTimeout(id);
    }, [snake1, snake2, dir1, dir2, running, tickSpeed, food1, food2, score, highscore, createFood]);

    return  {
        snake1, 
        snake2,
        food1,
        food2, 
        score,
        highscore,
        running,
        startGame,
        setTickSpeed: ()=>{},
        resetHighscore,
        setRunning,
    }
}


function setFoodLocation(setFood, snake1, snake2) {
    const rand = (max) => {
            return Math.round((Math.random() * max) / unitSize) * unitSize;
        };
    let foodLocation = {x: rand(canvasSize - unitSize), y: rand(canvasSize - unitSize)};
    while (snake1.some(seg => seg.x == foodLocation.x && seg.y == foodLocation.y) && snake2.some(seg => seg.x == foodLocation.x && seg.y == foodLocation.y)) {
        foodLocation = {x: rand(canvasSize - unitSize), y: rand(canvasSize - unitSize)};
    }
    setFood({x: foodLocation.x, y: foodLocation.y});
}

function changeDirection(e, left, up, right, down, dir, setDir) {
    switch (e.code) {
        case left :
            if (dir.x === 0) {
                setDir({x: -unitSize, y: 0});
            }
            break;
        case up:
            if (dir.y === 0) {
                setDir({x: 0, y: -unitSize});
            }
            break;
        case right:
            if (dir.x === 0) {
                setDir({x: unitSize, y: 0});
            }
            break;
        case down:
            if (dir.y === 0) {
                setDir({x: 0, y: unitSize});
            }
            break;
        case "space":
            startGame();
            break;
        default:
            break;
}} 