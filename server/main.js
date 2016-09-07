import { Meteor } from 'meteor/meteor';

import '../imports/api/tasks.js';
import { Conns } from  '../imports/api/conns.js';
import { Ips } from '../imports/api/ips.js';



Meteor.startup(() => {
  // code to run on server at startup
  Meteor.onConnection(function(conn){
    connID = conn.id ;
    ipAdr = conn.clientAddress ;
    var realIP = conn.httpHeaders['x-real-ip'] ;
    //var firstVisited = FlowRouter.current(); //UNDEF
    //console.log(firstVisited.path);
    console.log('connID'.connID);
    // console.log(this.connection.id) this returns error

    //trying to send the connID to the client
        // Meteor.methods({
        //   getSessionId: function() {
        //   return connID;
        //   }
        // });
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
            clicks: Array(),
            visits: Array(),
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
          clicks: Array(),
          visits: Array(),
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


    });// Meteor onConnection
});//Meteor startup

Meteor.methods({
  'updateDB':function({clientIp,clientConnId,clickedOne}){
      //     Ips.update(
      //     { "ipAdr": clientIp, "connections.connID": clientConnId},
      //     { "$push":
      //         {"connections.$.clicks":
      //             {
      //                 'clickedThis': clickedOne, 'clickedAt': new Date(),
      //             }
      //         }
      //     }
      // )
      // debugger;

      console.log('clientIp'.clientIp);
      console.log('clientConnId'.clientConnId);
      console.log('ipAdr'.ipAdr);
      Ips.findAndModify({

          //Find the desired document based on specified criteria
          query: { "ipAdr": ipAdr, connections: { $elemMatch: { connID: connID}}},

          //Update only the elements of the array where the specified criteria matches
          update: { $push: { 'connections.$.clicks': {clickedThis: clickedOne, clickedAt: new Date()} }}
      });
  },
  // 'getIP': function () {
  //     return this.connection.clientAddress;
  // },
  'updateHistory': function ({clientIp,clientConnId,visitedOne}) {
    console.log('UpdateHistory');
    Ips.findAndModify({

        //Find the desired document based on specified criteria
        query: { "ipAdr": ipAdr, connections: { $elemMatch: { connID: connID}}},

        //Update only the elements of the array where the specified criteria matches
        update: { $push: { 'connections.$.visits': {visitedThis: visitedOne, visitedAt: new Date()} }}
    });
  },
});
