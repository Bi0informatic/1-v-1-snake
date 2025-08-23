'use client'

import React, {useRef, useEffect} from 'react'

const boardBackground = "#b7a148"
const snakeColor = "#485eb7"
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25;
const canvasSize = 500;

export default function GameCanvas({snake, food, running}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d");

        drawBackground(ctx);
        drawFood(ctx, food);
        drawSnake(ctx, snake);


        if (!running) {
            ctx.font = "50px Times New Roman";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER!", gameWidth/2, gameHeight/2);
        }
    });

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

function drawSnake(ctx, snake) {
    ctx.fillStyle = snakeColor;
    ctx.strokeBorder = snakeBorder;

    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, unitSize, unitSize);
        ctx.strokeRect(snake[i].x, snake[i].y, unitSize, unitSize);
    }
}