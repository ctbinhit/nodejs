// app/routes.js

module.exports  = function(app,conf){
  var conf_root = conf.root;
  app.get("/",function(req,res){
     res.render(conf_root.client+ "/index/index");
  });

  app.get("/room/general",function(req,res){
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    /* Get ip form request
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
        */
        //console.log(ip);
    res.render(conf_root.client + "/room/general",{
      data:{
        user:""
      }
    });
  });

  app.get("/signup",function(req,res){
    res.render(conf_root.client + "/signup/index");
  })
}
