import { Meteor } from 'meteor/meteor';

import '../imports/api/tasks.js';
import '../imports/api/conns.js';

Meteor.startup(() => {
  // code to run on server at startup
  Meteor.onConnection(function(conn){
      // console.log(conn);
      connInfoS.insert({
        connID: conn.id,
        ipAdr: conn.clientAddress,
        httpHeads: conn.httpHeaders,
      });
});
