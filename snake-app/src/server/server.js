const express = require("express");
const socket = require("socket.io");

const Session = require("./session").default;
const Client = require("./client").default;
require('dotenv').config();

const CLIENT_LIMIT = 2;
const port = process.env.PORT || 4000;
const sessions = new Map();

const app = express();
const server = app.listen(port, ()=>console.log("Listening to requests on port: " + port));
// TODO: remember to change origin to restricted trusted domains
const io = socket(server, { cors: {origin: '*'}});
// listener for server
io.on("connection", socket => {
    console.log("Connected to socket: ", socket.id);
    const client = createClient(socket);
    // listener for event: "message" for each client/socket
    socket.on("message", msg => {
        const data = JSON.parse(msg);

        switch (data.type) {
            case "create-session": {
                const session = createSession();
                session.join(client);
                client.send({
                    type: "session-created",
                    id: session.id
                });
                break;
            };
            case "join-session": {
                const session = getSession(data.id) || createSession(data.id);
                if (session.clients.size === CLIENT_LIMIT) {
                    const sessionNew = createSession();
                    sessionNew.join(client);
                    client.send({
                        type: "session-created",
                        id: sessionNew.id
                    });
                    break;
                }
                session.join(client);
                broadcastSession(session);
                break;
            }
            case "start-session": {
                const session = getSession(data.id);
                if (!session) return;
                session.readyClients.add(client.id);

                client.broadcast({
                    type: "player-ready",
                    id: client.id
                })
                if (session.readyClients == CLIENT_LIMIT) {
                    session.startGameLoop();
                }
                session.clients.forEach(c => {
                    c.send({ type: "game-started" });
                });
                // both players must press play to trigger
                // broadcast start-request then once both are true will start game
            }
            case "state-update":
                client.broadcast(data);
                break;
            case "state-broadcast":
                client.broadcast(data);
                break;

        }
    });

    socket.on("disconnect", () => {
        console.log("Connection closed");
        const session = client.session;
        if (session) {
            session.leave(client);
            if (session.clients.size === 0) {
                sessions.delete(session.id);
            }
            broadcastSession(session);
        }
    })
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