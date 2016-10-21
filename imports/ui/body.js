import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Ips } from '../api/ips.js';

import { ReactiveDict } from 'meteor/reactive-dict';

import "./body.html";

Template.ips.helpers({
  ips() {
    // console.log(Ips.find({},{sort: { createdAt: -1 } }).fetch());
    return JSON.stringify(Ips.find({}, {
      sort: {
        createdAt: -1
      }
    }).fetch(), undefined, 2);
  },
});

//MAKING THE UI


Template.ui.helpers({
  ips() {
    //  var Ips =
    console.log(Ips.find({}, {
      sort: {
        createdAt: -1
      }
    }));
    return Ips.find({}, {
      sort: {
        createdAt: -1
      }
    });
  },
});



//MAKING THE UI END

Template.ip.events({
  "click .showHide": function(event, template) {
      console.log('I log');
      // console.log($(this));// this is the whole template
      console.log(event.target);
      $(function() {
        // your jQuery code here...

        $(event.target).next('.conns').toggle(500); //event.target is the event emitter
      });
    } //.showHide clicks

}); //Template.ip.events



Template.mainLayout.events({
  "click *": function(event, template) {
    // console.log($(event.target));
    if (!($(event.target).hasClass('link'))) {
      event.stopPropagation();
    }
    //  event.stopPropagation();
    // console.log(ActiveRoute.path('/home'));
    console.log('body all click log');
    //  console.log(c0nnIp);
    var clickedOne = $(event.target).html().toString();
    console.log('This click ' + clickedOne);
    //getting the connID

    var clientIp = headers.getClientIP(); // this is needed indeed however it gets the proxy ip
    var clientConnId = Meteor.connection._lastSessionId;
    console.log("clientIp", clientIp);
    console.log('clientConnId'.clientConnId);



    Meteor.call("updateDB", {
      clientIp, clientConnId, clickedOne
    }, function(error, result) {
      if (error) {
        console.log("error", error);
      }
      if (result) {

      }
    });

  }, // click *
}); //events

Template.mainLayout.onCreated(function() {
  console.log("mainLayout created");
  var context = FlowRouter.current();
  // use context to access the URL state
  console.log(context);
  var visitedOne = context.path;

  //getting the connID
  var clientConnId;
  var clientIp = headers.getClientIP();
  var connIdInterval = Meteor.setInterval(function() {
    console.log('interval');
    if (Meteor.connection._lastSessionId) {
      clientConnId = Meteor.connection._lastSessionId;
      Meteor.clearInterval(connIdInterval);
      console.log(clientIp);
      console.log('clienetConnId', clientConnId);
      // console.log(Meteor.connection._lastSessionId);



      Meteor.call("updateHistory", {
        clientIp, clientConnId, visitedOne
      }, function(error, result) {
        if (error) {
          console.log("error", error);
        }
        if (result) {

        }
      }); //Meteor.call
    }
  }, 300); //connIdInterval

  Meteor.subscribe("ips");

}); //Template.mainLayout.onCreated
