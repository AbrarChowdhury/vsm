const express = require('express')
const http = require('http')
const WebSocket = require('ws')

// const port = process.env.PORT || 8080
const port = 8080

const app = express()
let connection
const httpServer = http.createServer(app)
const wss = new WebSocket.Server({
    'server': httpServer
})

app.get("/",(req,res)=>{
    res.send(`VSM Bioforge ${connection}`)
})

wss.on("connection", function (ws) {
  console.log("new client connected");
  connection = "connected"
  ws.on("close", function () {
    console.log("lost one client");
  });
  ws.on("message", function (message) {
    console.log("Received: " + message);
    console.log("---------------------------")
    //broadcast incoming message to all clients (s.clients)
    wss.clients.forEach(function (client) {
      if (client != ws && client.readyState) {
        client.send("broadcast: " + message);
      }
    });
  });
});
wss.on("close",()=>{
  console.log("client disconnected")
})

httpServer.listen(port, ()=>console.log(`server listening at port ${port}`))