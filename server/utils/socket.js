const { Server } = require("socket.io");
var expressJwt = require('express-jwt')
var constant = require('../utils/constant')

var io, userSockets;

exports.createIOSocket = function (server) {
    io = new Server(server, {
        cors: {
          origin: true,
          methods: ["GET","POST"],
          maxAge: 60
        }
    });
      
      // io.use((socket, next) => {
      //   const token = socket.handshake.auth.token;
      //   console.log(token)
      //   next();
      // });
      
    const wrap = middleware => (socket, next) => middleware(socket.handshake.auth, {}, next);
        io.use(wrap(expressJwt({ 
        secret: constant.SECRET, 
        algorithms: ['HS256'],
        getToken: function fromHeaderOrQuerystring (req) {
            return req.token
        }
    })))
    
    io.on("connection", (socket) => {
        console.log(socket.handshake.auth.user)
        // console.log('a user connected');
        // socket.emit('serverEvent', 'my name is wangxiaolong');
        socket.join(socket.handshake.auth.user.userid.toString());
        // if (userSockets[userid] && Array.isArray(userSockets[userid])) {
        //     userSockets[userid].push(socket.id)
        // } else {
        //     userSockets[userid] = [ socket.id ]
        // }
        socket.on('videoChatEvent', (data) => {
            // console.log('videoChatEvent: ' + socket.handshake.auth.user.userid);
            var msg = JSON.parse(data);
            sendMessage([msg.target], 'videoChatEvent', data)
        });
        socket.on('disconnect', () => {
            // userSockets[userid] = null;
        });
    });
}

function sendMessage (useridarr, eventname, msg) {
    useridarr.forEach(async userid => {
        const sockets = await io.in(userid.toString()).fetchSockets();
        for (let socket of sockets) {
            socket.emit(eventname, msg);
        } 
    });
}

exports.sendMessage = sendMessage