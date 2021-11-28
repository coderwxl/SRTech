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
        // console.log(socket.handshake.auth.user)
        // console.log('a user connected');
        // socket.emit('serverEvent', 'my name is wangxiaolong');
        socket.join(socket.handshake.auth.user.userid.toString());
        // if (userSockets[userid] && Array.isArray(userSockets[userid])) {
        //     userSockets[userid].push(socket.id)
        // } else {
        //     userSockets[userid] = [ socket.id ]
        // }
        // socket.on('clientEvent', (msg) => {
        //     console.log('message: ' + msg);
        // });
        socket.on('disconnect', () => {
            // userSockets[userid] = null;
        });
    });
}

exports.sendMessage = async function (userid, msg) {
    const sockets = await io.in(userid.toString()).fetchSockets();
    for (let socket of sockets) {
        socket.emit("newMessage", msg);
    }
}