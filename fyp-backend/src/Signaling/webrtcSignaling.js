const WebSocket = require("ws");

const wss = new WebSocket.Server({ noServer: true });

let users = {}; // Store connected users

wss.on("connection", (ws, req) => {
  console.log("New WebSocket connection");

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case "join":
        users[data.userId] = ws;
        console.log(`User ${data.userId} joined`);
        break;

      case "offer":
      case "answer":
      case "candidate":
        if (users[data.target]) {
          users[data.target].send(JSON.stringify(data));
        }
        break;

      case "leave":
        delete users[data.userId];
        break;
    }
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

function setupSignaling(server) {
    server.on("upgrade", (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    });
  }
  
  module.exports = setupSignaling;