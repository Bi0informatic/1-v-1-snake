import socketIOClient from "socket.io-client";
export default class ConnectionManager {
    constructor(snakeManager) {
        this.conn = null;
        this.peers = new Map();
        this.snakeManager = snakeManager;
    }

    connect(address) {
        this.conn = socketIOClient(address);
        this.conn.on("connect", ()=>{
            console.log("Connection established");
            this.initSession();
            this.watchEvents();
        });

        this.conn.on("message", data => {
            this.recieve(data);
        });
    }

    initSession() {
        const sessionId = window.location.hash.split("#")[1];
        if (sessionId) {
            this.send({
                type: "join-session",
                id: sessionId
            });
        } else {
            this.send({
                type: "create-session"
            });
        }
    }

    watchEvents() {
        const localPlayer = this.snakeManager.state.players.get("localPlayer");
        const events = localPlayer.events;
        [].forEach((prop)=>{
            events.listen(prop, value => {
                this.send({
                    type: "state-update",
                    state: [prop, value]
                });
            });
        });
        events.listen("state", state => {
            this.send({
                type: "state-broadcast",
                state
            })
        })
    }
    
    updateManager(peers) {
        const me = peers.you;
        const clients = peers.clients.filter(client => me !== client);
        clients.forEach(client => {
            if (!this.peers.has(client)) {
                this.snakeManager.createPlayer(client);
                this.peers.set(client, client);
            }
        });

        this.peers.forEach(client => {
            if (clients.findIndex(id => id === client) === -1) {
                console.log("Remove ", client);
                this.snakeManager.removePlayer(client);
                this.peers.delete(client);
            }
        });

        const sorted = peers.clients.map(client => this.peers.get(client) || "localPlayer");
        this.snakeManager.sortPlayers(sorted);
    }

    updatePeer(id, [prop, value]) {
        if (!this.peers.has(id)) {
            console.error("Client does not exist ", id);
            return;
        }
        this.snakeManager.updateSnakeManager(id, { prop, value });
    }

    send(data) {
        const msg = JSON.stringify(data);
        console.log(`Sending message: ${msg}`);
        this.conn.send(msg);
    }

    recieve(msg) {
        const data = JSON.parse(msg);
        console.log("Recieved Message: ", data);
        switch (data.type) {
            case "session-created": {
                window.location.hash = data.id;
                break;
            };
            case "session-broadcast": {
                this.updateManager(data.peers);
                break;
            };
            case "state-update": {
                this.updatePeer(data.clientId, data.state);
                break;
            };
            case "state-broadcast": {
                Object.entries(data.state).forEach(entry => {
                    this.updatePeer(data.clientId, entry);
                });
                break;
            };
        }
    }
}