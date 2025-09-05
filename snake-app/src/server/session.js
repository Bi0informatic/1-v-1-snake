export default class Session {
    // session should only start if there are two players
    constructor(id) {
        this.id = id;
        this.clients = new Set();
        this.readyClients = new Set();
        this.state = this.initializeGameState();
        this.tickSpeed = 80;
        this.interval = null;
        this.unitSize = 25;
        this.canvasSize = 500;
    }
    
    initializeGameState() {
        return {
            players: [],
            food1: {x: 0, y: 0},
            food2: {x: 0, y: 0},
            running: true
        };
    }

    startGameLoop() {
        if (this.state.players.length == 1) {
            const client = [...this.clients][0];
            // poll to check for any new players?
            client.send({
                type: "need-more-players"
            })
            return;
        } else if (this.state.players.length == 0) {
            return;
        };
        // assume only two players concurrently max
        [...this.readyClients].forEach((client)=>{
            this.createInitialPlayerState(client.id);
        })
        this.interval = setInterval(()=>{
            this.updateGameState();
            this.broadcastGameState();
            console.log("tick");
        }, this.tickSpeed);
    }
    stopGameLoop() {
        clearInterval(this.interval);
        this.interval = null;
    }
    // iterates state.players
    updateGameState() {
        // move snakes, check collisions, update food and etc
        // update food
        // check for collisions
        // move snakes
        if (this.state.players.length < 2) return; // game ends if less than 2?

        const snake1 = this.state.players[0].snake;
        const snake2 = this.state.players[1].snake;
        const dir1 = this.state.players[0].dir;
        const dir2 = this.state.players[1].dir;

        this.hitWallOrSelf(snake1, dir1);
        this.hitWallOrSelf(snake2, dir2);

        this.hitOther();

        this.eatFood(this.setSnake1, snake1, dir1);
        this.eatFood(this.setSnake2, snake2, dir2);

        if (this.state.running === false) {
            this.stopGameLoop();
        }
    }

    broadcastGameState() {
        try {[...this.clients].forEach((client)=>{
                client.send({ type: "game-tick", state: this.state })
            });
            } catch (err) {
            console.error("Failed to send game state", err);
        }
    }
    // player = {id, snake, dir}
    // createInitialPlayerState should only ever be run twice in a session
    createInitialPlayerState(id) {
        if (this.state.players.some(p => p.id === id)) return;
        if (this.state.players.length === 0) {
            this.state.players.push({
                id,
                snake:  [
                    {x:this.unitSize * 2, y: this.unitSize * 10},
                    {x:this.unitSize, y: this.unitSize * 10},
                    {x:0, y: this.unitSize * 10}
                ],
                dir: {x: this.unitSize, y: 0}
            });
        } else {
            this.state.players.push ({
                id,
                snake:  [
                    {x:this.unitSize * 17, y: this.unitSize * 10},
                    {x:this.unitSize * 18, y: this.unitSize * 10},
                    {x:this.unitSize * 19, y: this.unitSize * 10}
                ],
                dir: {x: -this.unitSize, y: 0}
            })
            this.createFood();
        }
    }

    setFoodLocation(setFood, snake1, snake2) {
        const rand = (max) => {
                return Math.round((Math.random() * max) / this.unitSize) * this.unitSize;
            };
        let attempts = 0;
        let foodLocation = {x: rand(this.canvasSize - this.unitSize), y: rand(this.canvasSize - this.unitSize)};
        while ((snake1.some(seg => seg.x == foodLocation.x && seg.y == foodLocation.y) || snake2.some(seg => seg.x == foodLocation.x && seg.y == foodLocation.y)) && attempts < 1000) {
            foodLocation = {x: rand(this.canvasSize - this.unitSize), y: rand(this.canvasSize - this.unitSize)};
            attempts++;
        }
        setFood({x: foodLocation.x, y: foodLocation.y});
    }

    createFood() {
        const snake1 = this.state.players[0].snake;
        const snake2 = this.state.players[1].snake;
        this.setFoodLocation(this.setFood1, snake1, snake2);
        this.setFoodLocation(this.setFood2, snake1, snake2);
    }

    setFood1(location) {
        this.state.food1 = location;
    }

    setFood2(location) {
        this.state.food2 = location;
    }

    //this.hasEaten(snake2, dir2, food1, food2);
    eatFood(setSnake, snake, dir) {
        const head = {
            x: snake[0].x + dir.x,
            y: snake[0].y + dir.y
        }
        const food1 = this.state.food1;
        const food2 = this.state.food2;

        let ate = false;
        if (head.x === food1.x && head.y === food1.y || head.x === food2.x && head.y === food2.y) {  
            ate = true;
            this.createFood();
        }

        const newSnake = [head, ...snake];
        if (!ate) newSnake.pop();
        setSnake(newSnake);
    }
    

    setSnake1(newSnake) {
        this.state.players[0].snake = newSnake;
    }

    setSnake2(newSnake) {
        this.state.players[1].snake = newSnake;
    }

    hitWallOrSelf(snake, dir) {
        // this.state.players[0].snake
        // this.state.players[0].dir
        const head = {
            x: snake[0].x + dir.x,
            y: snake[0].y + dir.y
        }
        
        const hitWall = head.x < 0 || head.y < 0 || head.x >= this.canvasSize || head.y >= this.canvasSize;
        const hitSelf = snake.slice(1).some(seg => seg.x === head.x && seg.y === head.y);

        if (hitWall || hitSelf) {
            this.setRunning(false);
            return;
        };
    }

    hitOther() {
        const snake1 = this.state.players[0].snake;
        const snake2 = this.state.players[1].snake;
        const dir1 = this.state.players[0].dir;
        const dir2 = this.state.players[1].dir;
        const head1 = {
            x: snake1[0].x + dir1.x,
            y: snake1[0].y + dir1.y
        }

        const head2 = {
            x: snake2[0].x + dir2.x,
            y: snake2[0].y + dir2.y
        }

        const hitOther1 = snake2.some(seg2=>head1.x === seg2.x && head1.y === seg2.y);
        const hitOther2 = snake1.some(seg1=>head2.x === seg1.x && head2.y === seg1.y);

        if (hitOther1 || hitOther2) {
            this.setRunning(false);
            return;
        };
    }

    setRunning(running) {
        this.state.running = running;
    }


    join(client) {
        if (client.session) {
            throw new Error("Client already in session");
        }

        this.clients.add(client);
        client.session = this;
    }

    leave(client) {
        if (client.session !== this) {
            throw new Error("Client not in session");
        }
        // needs to end session when client is leaves
        this.clients.delete(client);
        client.session = null;
    }
}
