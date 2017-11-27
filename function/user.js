exports.findUserBySocketId = function (pUsers,pSocketId){
    var n = 0;

    while(n<pUsers.length){
      if(pUsers[n].id == pSocketId){
        return pUsers[n];
      }
      n++;
    }
    return null;
};
