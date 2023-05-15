const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "https://reactchatappclientfront.onrender.com",
  },
});


io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    // find existing session
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.username = session.username;
      return next();
    }
  }


  const username = socket.handshake.auth.fetched_userName;
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
      key: id,
      messages:[]
    });
  }
  socket.emit("users", users);
  console.log("users : ",users);

  socket.on("update user", (user)=>{
    console.log(user)
  })


  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
    key: socket.id,
    self: false,
    messages:[],
  });

  socket.on("private message", ({ content, to }) => {
    console.log("Content:", content, " To:", to);
    socket.to(to).emit("private message", {
      content,
      from: socket.id,
    });
    
  });

  socket.on("send-notification",({content, to})=>{
    // io.emit("new-notification", data)
    // socket.broadcast.emit("new-notification", content);
    socket.to(to).emit('new-notification', content)
  })

});

http.listen(4200, () => {
  console.log("Listening on port 4200");
});
