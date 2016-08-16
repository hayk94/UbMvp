import { Meteor } from 'meteor/meteor';

import '../imports/api/tasks.js';
import { Conns } from  '../imports/api/conns.js';

Meteor.startup(() => {
  // code to run on server at startup
  Meteor.onConnection(function(conn){
      console.log(conn);
      Conns.insert({
        connID: conn.id,
        ipAdr: conn.clientAddress,
        httpHeads: {
          host: conn.httpHeaders.host,
          userAgent:conn.httpHeaders['user-agent'],
          realIP: conn.httpHeaders['x-real-ip'],
        },
        createdAt: new Date(),
      });
    });
});
