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

        this.conn.on("disconnect", (reason)=>{
            console.warn("Connection lost: ", reason);
            alert("Connection has been lost");
        })

        this.conn.on("connect_error", (error) =>{
            console.error("Connection error: ", error);
        })


        this.conn.on("message", data => {
            this.recieve(data);
        });
    }

    disconnect() {
        if (this.conn) {
            this.conn.disconnect();
            window.location = "";
            console.log("Disconnected from server");
        }
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
        // makes sure that peers has every client except for the current one
        clients.forEach(client => {
            if (!this.peers.has(client)) {
                this.snakeManager.createPlayer(client);
                this.peers.set(client, client);
            }
        });
        // removes clients that are not in peers
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
    //
    updatePeer(id, [prop, value]) {
        if (!this.peers.has(id)) {
            console.error("Client does not exist ", id);
            return;
        }
        this.snakeManager.updateSnakeState(id, { prop, value });
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
            // adds id to site when session has been joined
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