export default class Session {
    constructor(id) {
        this.id = id;
        this.clients = new Set();
        this.state = this.initializeGameState();
        this.tickSpeed = 80;
        this.interval = null;
        this.unitSize = 25;
        this.canvasSize = 500;
    }
    
    initializeGameState() {
        return {
            players: {},
            food1: {x: 0, y: 0},
            food2: {x: 0, y: 0},
            running: true
        };
    }

    startGameLoop() {
        this.interval = setInterval(()=>{
            this.updateGameState();
            this.broadcastGameState();
        }, this.tickSpeed);
    }
    stopGameLoop() {
        clearInterval(this.interval);
    }

    updateGameState() {
        // move snakes, check collisions, update food and etc
    }

    broadcastGameState() {
        this.clients.forEach(client => {
            client.send({
                type: "game-tick",
                state: this.state
            })
        })
    }

    createInitialPlayerState(id) {
        if (this.state.players.size === 0) {
            return {
                id,
                snake:  [
                    {x:unitSize * 2, y: unitSize * 10},
                    {x:unitSize, y: unitSize * 10},
                    {x:0, y: unitSize * 10}
                ],
                dir: {x: unitSize, y: 0}
            }
        } else {
            return {
                id,
                snake:  [
                    {x:unitSize * 17, y: unitSize * 10},
                    {x:unitSize * 18, y: unitSize * 10},
                    {x:unitSize * 19, y: unitSize * 10}
                ],
                dir: {x: -unitSize, y: 0}
            }
        }
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

        this.clients.delete(client);
        client.session = null;
    }
}
/*
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
*/
