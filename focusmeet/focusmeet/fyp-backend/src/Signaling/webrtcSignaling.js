const WebSocket = require("ws");
const { v4: uuidv4 } = require('uuid');

const wss = new WebSocket.Server({ noServer: true });

let meetings = {}; // Store connected users per meeting

wss.on("connection", (ws, req) => {
    console.log("New WebSocket connection");
    debugger;
    console.log('Connected client IP:', req.connection.remoteAddress);

    const userId = uuidv4(); // Generate a unique user ID for this connection
    console.log('Generated User ID:', userId);
    ws.userId = userId; // Attach userId to the WebSocket object

    wss.on("connection", (ws, req) => {
    console.log("New WebSocket connection");
    debugger;
    console.log('Connected client IP:', req.connection.remoteAddress);

    const userId = uuidv4(); // Generate a unique user ID for this connection
    console.log('Generated User ID:', userId);
    ws.userId = userId; // Attach userId to the WebSocket object

    wss.on("connection", (ws, req) => {
      console.log("New WebSocket connection");
      console.log('Connected client IP:', req.connection.remoteAddress);
      debugger;
  
      const userId = uuidv4(); // Generate a unique user ID for this connection
      console.log('Generated User ID:', userId);
      debugger;
      ws.userId = userId; // Attach userId to the WebSocket object
  
      ws.on("message", (message) => {
          console.log(`Received message => ${message}`);
          const data = JSON.parse(message);
  
          switch (data.type) {
              case "join":
                  const meetingId = data.meetingId;
                  const role = data.role; // Expecting 'role' in the join message
  
                  if (!meetingId) {
                      console.log("Error: 'join' message missing meetingId");
                      return;
                  }
  
                  if (!role || (role !== 'student' && role !== 'teacher')) {
                      console.log("Error: 'join' message missing or invalid role:", role);
                      return;
                  }
  
                  if (!meetings[meetingId]) {
                      meetings[meetingId] = {};
                  }
  
                  meetings[meetingId][userId] = {
                      ws: ws,
                      role: role // Store the user's role
                  };
  
                  console.log(`User ${userId} (${role}) joined meeting ${meetingId}`);
                  console.log('Current participants in meeting', meetingId, ':', Object.keys(meetings[meetingId]));
  
                  // Notify all other users in the meeting that a new user joined
                  Object.keys(meetings[meetingId]).forEach((otherUserId) => {
                      if (otherUserId !== userId) {
                          const otherUser = meetings[meetingId][otherUserId];
                          otherUser.ws.send(JSON.stringify({
                              type: "new-user",
                              userId: userId,
                              role: role // Send the new user's role
                          }));
                      }
                  });
                  break;
  
              case "offer":
              case "answer":
              case "candidate":
                  const targetUserId = data.target;
                  const targetMeetingId = Object.keys(meetings).find(meetingKey => meetings[meetingKey][targetUserId]);
                  if (targetMeetingId && meetings[targetMeetingId] && meetings[targetMeetingId][targetUserId]) {
                      meetings[targetMeetingId][targetUserId].ws.send(JSON.stringify(data));
                  }
                  break;
  
              case "leave":
                  Object.keys(meetings).forEach(meetingKey => {
                      if (meetings[meetingKey][userId]) {
                          const userToRemove = meetings[meetingKey][userId];
                          delete meetings[meetingKey][userId];
                          console.log(`User ${userId} (${userToRemove.role}) left meeting ${meetingKey}`);
                          // Optionally notify other users in the meeting
                          Object.keys(meetings[meetingKey]).forEach((otherUserId) => {
                              const otherUser = meetings[meetingKey][otherUserId];
                              otherUser.ws.send(JSON.stringify({
                                  type: "user-left",
                                  userId: userId,
                                  role: userToRemove.role // Send the role of the leaving user
                              }));
                          });
                      }
                  });
                  break;
          }
      });
  
      ws.on("close", () => {
          console.log("WebSocket connection closed for user:", userId);
          // Remove user from all meetings they might be in
          Object.keys(meetings).forEach(meetingKey => {
              if (meetings[meetingKey][userId]) {
                  const userToRemove = meetings[meetingKey][userId];
                  delete meetings[meetingKey][userId];
                  // Optionally notify other users in the meeting about the leave
                  Object.keys(meetings[meetingKey]).forEach((otherUserId) => {
                      const otherUser = meetings[meetingKey][otherUserId];
                      otherUser.ws.send(JSON.stringify({
                          type: "user-left",
                          userId: userId,
                          role: userToRemove.role // Send the role of the leaving user
                      }));
                  });
              }
          });
      });
  });

    ws.on("close", () => {
        console.log("WebSocket connection closed for user:", userId);
        // Remove user from all meetings they might be in
        Object.keys(meetings).forEach(meetingKey => {
            if (meetings[meetingKey][userId]) {
                const userToRemove = meetings[meetingKey][userId];
                delete meetings[meetingKey][userId];
                // Optionally notify other users in the meeting about the leave
                Object.keys(meetings[meetingKey]).forEach((otherUserId) => {
                    const otherUser = meetings[meetingKey][otherUserId];
                    otherUser.ws.send(JSON.stringify({
                        type: "user-left",
                        userId: userId,
                        role: userToRemove.role // Send the role of the leaving user
                    }));
                });
            }
        });
    });
});

    ws.on("close", () => {
        console.log("WebSocket connection closed for user:", userId);
        // Remove user from all meetings they might be in
        Object.keys(meetings).forEach(meetingKey => {
            if (meetings[meetingKey][userId]) {
                delete meetings[meetingKey][userId];
                // Optionally notify other users in the meeting about the leave
                Object.keys(meetings[meetingKey]).forEach((otherUserId) => {
                    meetings[meetingKey][otherUserId].send(JSON.stringify({
                        type: "user-left",
                        userId: userId
                    }));
                });
            }
        });
    });
});

function setupSignaling(server) {
    server.on("upgrade", (request, socket, head) => {
        console.log("Upgrade request received:", request.headers);

        // Handle WebSocket upgrade
        wss.handleUpgrade(request, socket, head, (ws) => {
            console.log("New WebSocket connection established.");
            wss.emit("connection", ws, request);
        });
    });

    // Log the port WebSocket is running on
    const port = process.env.PORT || 5000;
    console.log(`WebSocket is running on port: ${port}`);
}

module.exports = setupSignaling;