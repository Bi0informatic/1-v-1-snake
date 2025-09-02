export default class Client {
    constructor(conn, id) {
        this.conn = conn;
        this.id = id;
        this.session = null;
    }

    broadcast(data) {
        if (!this.session) {
            throw new Error("Cannot broadcast without session");
        }

        data.clientId = this.id;
        this.session.clients.forEach(client=>{
            if (this === client) {
                return;
            }
            client.send(data);
        })
    }
    // sends msg to client/socket
    send(data) {
        const msg = JSON.stringify(data);
        console.log(`Sending message: ${msg}`);
        this.conn.send(msg, err => {
            if (err) {
                console.log("Message failed", msg, err);
            }
        })
    }
}