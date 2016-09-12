import {
  Meteor
}
from 'meteor/meteor';

import {
  HTTP
}
from 'meteor/http';

import '../imports/api/tasks.js';
import {
  Conns
}
from '../imports/api/conns.js';
import {
  Ips
}
from '../imports/api/ips.js';



Meteor.startup(() => {
  // code to run on server at startup
  Meteor.onConnection(function(conn) {
    connID = conn.id;
    ipAdr = conn.clientAddress;
    var realIP = conn.httpHeaders['x-real-ip'];
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
      } else {
        console.log(
          'You forget HTTP_FORWARDED_COUNT="1" or put the wrong number of proxies'
        );
      }
    }

    //check if the ip is registered
    // console.log(Ips.findOne({"ipAdr":ipAdr}));
    if (!Ips.findOne({
        "ipAdr": ipAdr
      })) {

      Ips.insert({
        ipAdr: ipAdr,
        connections: [{
          connID: conn.id,
          ipAdr: conn.clientAddress,
          httpHeads: {
            host: conn.httpHeaders.host,
            userAgent: conn.httpHeaders['user-agent'],
            realIP: conn.httpHeaders['x-real-ip'],
          }, //httpHeads
          connectedAt: new Date(),
          disconnectedAt: null,
          clicks: Array(),
          visits: Array(),
          hubspotInfo: Array(),
        }], //connections
        createdAt: new Date(),
      }); //Ips.insert
      //
      // console.log(); console.log();
    } else {
      Ips.update({
        "ipAdr": ipAdr
      }, {
        $push: {
          'connections': {
            connID: conn.id,
            ipAdr: conn.clientAddress,
            httpHeads: {
              host: conn.httpHeaders.host,
              userAgent: conn.httpHeaders['user-agent'],
              realIP: conn.httpHeaders['x-real-ip'],
            },
            connectedAt: new Date(),
            disconnectedAt: null,
            clicks: Array(),
            visits: Array(),
            hubspotInfo: Array(),
          }
        }
      });

    } //else

    conn.onClose(function() {
      console.log('connection closed');
      //findAndModify will always refer to one document
      Ips.findAndModify({

        //Find the desired document based on specified criteria
        query: {
          "ipAdr": ipAdr,
          connections: {
            $elemMatch: {
              connID: conn.id
            }
          }
        },

        //Update only the elements of the array where the specified criteria matches
        update: {
          $set: {
            'connections.$.disconnectedAt': new Date()
          }
        }
      });
    }); //onClose


  }); // Meteor onConnection
}); //Meteor startup

Meteor.methods({
  'updateDB': function({
    clientIp, clientConnId, clickedOne
  }) {
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
    clientIp = this.connection.clientAddress;
    console.log('clientIp', clientIp);
    console.log('clientConnId', clientConnId);
    console.log('ipAdr', ipAdr);
    console.log("THE IP ", this.connection.clientAddress);
    // clientConnId = Meteor.connection._lastSessionId;
    // console.log('clientConnId', clientConnId);
    Ips.findAndModify({

      //Find the desired document based on specified criteria
      query: {
        "ipAdr": clientIp,
        connections: {
          $elemMatch: {
            connID: clientConnId
          }
        }
      },

      //Update only the elements of the array where the specified criteria matches
      update: {
        $push: {
          'connections.$.clicks': {
            clickedThis: clickedOne,
            clickedAt: new Date()
          }
        }
      }
    });
  },
  // 'getIP': function () {
  //     return this.connection.clientAddress;
  // },
  'updateHistory': function({
    clientIp, clientConnId, visitedOne
  }) {
    // clientConnId = Meteor.connection._lastSessionId;
    // console.log('clientConnId', clientConnId);
    clientIp = this.connection.clientAddress;
    console.log('UpdateHistory clientConnId', clientConnId, "visitedOne",
      visitedOne, "clientIp", clientIp);
    console.log("THE IP ", this.connection.clientAddress);
    Ips.findAndModify({

      //Find the desired document based on specified criteria
      query: {
        "ipAdr": clientIp,
        connections: {
          $elemMatch: {
            connID: clientConnId
          }
        }
      },

      //Update only the elements of the array where the specified criteria matches
      update: {
        $push: {
          'connections.$.visits': {
            visitedThis: visitedOne,
            visitedAt: new Date()
          }
        }
      }
    });
  }, //updateHistory

  'pushHubspotInfo': function({
    clientConnId, UTK, result
  }) {
    console.log('pushHubspotInfo');
    // clientConnId = Meteor.connection._lastSessionId;
    // console.log('clientConnId', clientConnId);

    var clientIp = this.connection.clientAddress;

    console.log("pushHubspotInfo clientConnId ", clientConnId,
      "clientIp ", clientIp);
    Ips.findAndModify({

      //Find the desired document based on specified criteria
      query: {
        "ipAdr": clientIp,
        connections: {
          $elemMatch: {
            connID: clientConnId
          }
        }
      },

      //Update only the elements of the array where the specified criteria matches
      update: {
        $push: {
          'connections.$.hubspotInfo': {
            UTK: UTK,
            result: result
          }
        }
      }
    }); //Ips.findAndModify
  }, //pushHubspotInfo


  'getHubspotInfo': function({
    clientIp, clientConnId, UTK
  }) {
    // clientConnId = Meteor.connection._lastSessionId;
    // console.log('clientConnId', clientConnId);
    console.log('getHubspotInfo');
    clientIp = this.connection.clientAddress;
    var hapikey = "bdc95f4b-0d9f-4db5-a8ff-9ecb2d235063"; // XXX: This is set for testing purposes otherwise it should be set from somewhere else
    var url = "https://api.hubapi.com/contacts/v1/contact/utk/" + UTK +
      "/profile?hapikey=" + hapikey;

    HTTP.call("GET", url, function(error, result) {
      if (error) {
        console.log("error", error);
      }
      if (result) {
        console.log("result", result);
        console.log("getHubspotInfo clientConnId", clientConnId);
        Meteor.call("pushHubspotInfo", {
          clientConnId, UTK, result
        }, function(error, result) {
          if (error) {
            console.log("error", error);
          }
          if (result) {

          }
        });
      }
    }); //Http.call

  }, //getHubspotInfo
}); // Meteor Methods


//////////////////////// EXAMPLE HUBSPOT API URL ////////////////////////
// random contact id 3036763
//url: 'https://api.hubapi.com/contacts/v1/lists/recently_updated/contacts/recent?hapikey=bdc95f4b-0d9f-4db5-a8ff-9ecb2d235063'
//get by utk url: https://api.hubapi.com/contacts/v1/contact/utk/37782b7ceb743281d6d2872e9ebfd3be/profile?hapikey=bdc95f4b-0d9f-4db5-a8ff-9ecb2d235063
//////////////////////// EXAMPLE HUBSPOT API URL ////////////////////////
