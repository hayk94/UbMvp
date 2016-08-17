import { Meteor } from 'meteor/meteor';

import '../imports/api/tasks.js';
import { Conns } from  '../imports/api/conns.js';
import { Ips } from '../imports/api/ips.js';

Meteor.startup(() => {
  // code to run on server at startup
  Meteor.onConnection(function(conn){
    var connID = conn.id ;
    var ipAdr = conn.clientAddress ;
    var realIP = conn.httpHeaders['x-real-ip'] ;

    //checking whether we are getting the right ips
    if (ipAdr !== realIP) {
      if (!realIP) {
        console.log('You are running locally');
      }
      else {
        console.log('You forget HTTP_FORWARDED_COUNT="1" or put the wrong number of proxies');
      }
    }

    //check if the ip is registered
    // console.log(Ips.findOne({"ipAdr":ipAdr}));
    if (!Ips.findOne({"ipAdr":ipAdr})) {

        Ips.insert({
          ipAdr:ipAdr,
          connections: [{
            connID: conn.id,
            ipAdr: conn.clientAddress,
            httpHeads: {
              host: conn.httpHeaders.host,
              userAgent:conn.httpHeaders['user-agent'],
              realIP: conn.httpHeaders['x-real-ip'],
              },//httpHeads
            connectedAt: new Date(),
            disconnectedAt: null,
          }],//connections
          createdAt: new Date(),
        });//Ips.insert
      //
      // console.log(); console.log();
    }
    else {
      Ips.update({"ipAdr":ipAdr}, {$push:{
        'connections':{
          connID: conn.id,
          ipAdr: conn.clientAddress,
          httpHeads: {
            host: conn.httpHeaders.host,
            userAgent:conn.httpHeaders['user-agent'],
            realIP: conn.httpHeaders['x-real-ip'],
          },
          connectedAt: new Date(),
          disconnectedAt: null,
        }
      }});

    }//else

    conn.onClose(function () {
      console.log('connection closed');
      //findAndModify will always refer to one document
        Ips.findAndModify({

            //Find the desired document based on specified criteria
            query: { "ipAdr": ipAdr, connections: { $elemMatch: { connID: conn.id}}},

            //Update only the elements of the array where the specified criteria matches
            update: { $set: { 'connections.$.disconnectedAt': new Date()}}
        });
    });//onClose

      // console.log(conn);
      // Conns.insert({
      //   connID: conn.id,
      //   ipAdr: conn.clientAddress,
      //   httpHeads: {
      //     host: conn.httpHeaders.host,
      //     userAgent:conn.httpHeaders['user-agent'],
      //     realIP: conn.httpHeaders['x-real-ip'],
      //   },
      //   createdAt: new Date(),
      // });
    });// Meteor onConnection
});//Meteor startup
