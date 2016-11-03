import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo';

export const Ips = new Mongo.Collection("ips");



//////////////////////// PUBLICATIONS /////////////////////////////////////////
//Publish

if(Meteor.isServer){
  Meteor.publish("ips", function(){
    return Ips.find()
  })
}

//////////////////////// METHODS /////////////////////////////////////////
Meteor.methods({
  'updateDB': function({
    clientIp, clientConnId, clickedOne
  }) {
    clientIp = this.connection.clientAddress;
    console.log('clientIp', clientIp);
    console.log('clientConnId', clientConnId);
    console.log('ipAdr', ipAdr);
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
          'connections.$.clicks': {
            clickedThis: clickedOne,
            clickedAt: new Date()
          }
        }
      }
    });
  },

  'updateHistory': function({
    clientIp, clientConnId, visitedOne
  }) {

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
          'connections.$': {
            vid: result.data.vid, // vid is hubspot contact id
            firstName: result.data.properties.firstname.value,
            lastName: result.data.properties.lastname.value
            // NOTE: here should also be an image but hubspot does't give it for now
            // https://integrate.hubspot.com/t/can-we-use-contacts-api-to-retrieve-an-image-for-the-contact/731
          },
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

    console.log('getHubspotInfo');
    console.log("getHubspotInfo outside HTTP clientConnId", clientConnId);
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
        console.log("getHubspotInfo inside HTTP clientConnId",
          clientConnId);
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
