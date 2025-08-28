'use client'

import React, {useRef, useEffect} from 'react'

const boardBackground = "#b7a148"
const snakeColor = "#485eb7"
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25;
const canvasSize = 500;
const initialSnake = [
    {x:unitSize * 2, y: unitSize * 10},
    {x:unitSize, y: unitSize * 10},
    {x:0, y: unitSize * 10},
];
const initialFood = {x: 0, y: 0};

export default function GameCanvas({snake1, snake2, food, running}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d");

        drawBackground(ctx);
        drawFood(ctx, food);
        drawSnake(ctx, snake1);
        if (snake2) drawSnake(ctx, snake2);

        const initialState = snake1.every((seg, index)=>{
            return seg.x == initialSnake[index].x && seg.y == initialSnake[index].y && food.x == initialFood.x && food.y == initialFood.y;
        })

        if (!running && initialState) {
            ctx.font = "50px Times New Roman";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText("PRESS START!", canvasSize/2, canvasSize/2);
        } else if (!running) {
            ctx.font = "50px Times New Roman";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER!", canvasSize/2, canvasSize/2);
        }
    }, [snake1, food, running]);

    return <canvas id="game-canvas" ref={canvasRef} width={canvasSize} height={canvasSize}>Your browser does not support the HTML5 canvas tag.</canvas>;
}

function drawBackground(ctx) {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, canvasSize, canvasSize);
}

function drawFood(ctx, food) {
    ctx.fillStyle = foodColor;
    ctx.fillRect(food.x, food.y, unitSize, unitSize);
}

function drawSnake(ctx, snake1) {
    ctx.fillStyle = snakeColor;
    ctx.strokeBorder = snakeBorder;

    for (let i = 0; i < snake1.length; i++) {
        ctx.fillRect(snake1[i].x, snake1[i].y, unitSize, unitSize);
        ctx.strokeRect(snake1[i].x, snake1[i].y, unitSize, unitSize);
    }
}