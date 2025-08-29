const express = require("express");
const socket = require("socket.io");

const Session = require("./session");
const Client = require("./client");
require('dotenv').config();

const CLIENT_LIMIT = 2;
const port = process.env.PORT || 4000;
const sessions = new Map();

const app = express();
const server = app.listen(port, ()=>console.log("Listening to requests on port: " + port));
// TODO: remember to change origin to restricted trusted domains
const io = socket(server, { cors: {origin: '*'}});

io.on("connect", socket => {
    console.log("Connected to socket: ", socket.id);
});

socket.on("message", msg => {
    const data = JSON.parse(msg);

    switch (data.type) {
        case "create-session": {
            
        };
        break;
    }
});

function createID(len = 6, chars ="abcdefghjkmnopqrstwxyz0123456789") {
    let id = "";
    while (len--) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
}

function createClient(conn, id = createID()) {
    return new Client(conn, id);
}

function createSession(id = createID()) {
    if (sessions.has(id)) {
        throw new Error("Session ${id} already exists");
    }

    const session = new Session(id);
    console.log("Creating session ", session);

    sessions.set(id, session);
    return session;
}

function getSession(id) {
    return sessions.get(id);
}

function broadcastSession(session) {
    if (!session) return;
    
    const clients = [...session.clients];
    clients.forEach(client => {
        client.send({
            type: "session-broadcast",
            peers: {
                you: client.id,
                clients: clients.map(client=>client.id)
            }
        });
    });
}