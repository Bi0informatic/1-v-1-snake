import socketIOClient from "socket.io-client";
export default class ConnectionManager {
    constructor(snakeManager) {
        this.conn = null;
        this.peers = new Map();
        this.snakeManager = snakeManager;
    }
}