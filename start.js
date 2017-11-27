/*
Start.js
 */


//  Include Library ============================================================
  var datetime = require('node-datetime');
  var express   = require("express");
// Setup =======================================================================
var app       = express();
var port      = process.env.PORT  ||  88;
var conf = require("./config/conf.js");
// Configuration================================================================


  // Set up our express application
  app.use(express.static("public"));
  app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
  app.use('/bootstrap',express.static(__dirname + '/node_modules/bootstrap/dist'));
  app.set("view engine","ejs"); // Set up ejs for templating
  app.set("views","./views"); // Set up dir views

// Models
var user  = require('./models/user');
var msg   = require('./models/message');
// Routes
require("./app/routes.js")(app,conf);

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(port, function(){
  console.log("Server is running on port " + port);
});

var users = [];
var messages = [];

var func_user = require('./function/user');

io.on("connection",function(socket){
  console.log(socket.id + " has just connected.");
  checkUserChange();
   socket.on("disconnect",function(){
     //console.log("Someone has been disconnected." + socket.id);
     var n = users.indexOf(func_user.findUserBySocketId(users,socket.id));
     var nameOfUser=socket.id;
     if(n!=-1){
       nameOfUser = func_user.findUserBySocketId(users,socket.id).name;
     }
     io.sockets.emit("server-alert-user",{
       code : 778,
       msg  : nameOfUser + " has just disconnected."
     })
     if(n!=-1){
       users.splice(n,1);
     }


     checkUserChange();
   });

   socket.on("client-send-msg",function(data){
     var d = new Date();
     var tmp_msg = new msg(socket.id,func_user.findUserBySocketId(users,socket.id).name,data.msg,d.getTime(),data.date);
     messages.push(tmp_msg);
     //console.log(messages);
     io.sockets.emit('server-update-msg',{
       data : tmp_msg
     });
     // Server
     socket.emit('server-alert-user',{
       code : 777,
       idMsg : 'msg_' + socket.id + "_" + tmp_msg.pCDate,
     })
   })

   socket.on("client-send-sign-up-form",function(data){
     // If name of the user is already created on this server
     if(func_user.findUserBySocketId(users,socket.id)!=null){
       socket.emit("server-alert-user",{
         code : 101,
         msg  : "You've registered already."
       });
       return;
     }
     // Add new user
     users.push(new user(socket.id,data.name));

     checkUserChange();
     socket.emit("server-alert-user",{
       code : 200,
       msg  : "You've registered already."
     })
     io.sockets.emit("server-alert-user",{
       code : 779,
       idSocket : socket.id,
       msg  : data.name + " has just connected."
     })
   });

   function checkUserChange(){
     io.sockets.emit("server-change",{
       users  : users
     })
   }

});
