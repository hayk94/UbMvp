import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Tasks } from '../api/tasks.js';
import { Conns } from '../api/conns.js';
import { Ips } from '../api/ips.js';

import "./body.html";

Template.body.helpers({
  tasks(){
    return Tasks.find({});
  },
  conns(){
    return JSON.stringify(Conns.find({},{ sort: { createdAt: -1 } }),undefined,2);
  },
  ips(){
    // console.log(Ips.find({},{sort: { createdAt: -1 } }).fetch());
    return JSON.stringify(Ips.find({},{sort: { createdAt: -1 } }).fetch(),undefined,2);

    // return Ips.find({},{sort: { createdAt: -1 } });


  },
});

Template.registerHelper("keyval",function(object){
  return _.map(object, function(value, key) {
    return {
      key: key,
      value: value
    };
  });
});

// Template.ip.onCreated(function () {
//   console.log('created');
//   $(function() {
//     $(document).ready(function() {
//       $('.conns').hide();
//     });
//
//     });
//   });



Template.ip.events({
  "click .showHide": function(event, template){
    console.log('I log');
    // console.log($(this));// this is the whole template
    console.log(event.target);
    $(function() {
       // your jQuery code here...
      //  console.log($(event.target));
      //  console.log($(event.target).parent());
      //  console.log($(event.target).parent().next('conns'));
      //  console.log($(event.target).parent().next('conns').first());
      // console.log($(event.target).siblings('conns'));

       $(event.target).next('.conns').toggle(500); //event.target is the event emitter
   });
 }//.showHide clicks

});//Template.ip.events

Template.body.events({
  "click *": function(event, template){
     event.stopPropagation();
     console.log('body all click log');
     var clickedOne = $(event.target).html().toString();
     console.log('This click ' + clickedOne);
     //getting the connID
    //  Meteor.call("getSessionId", function(err, id) {
    //   return console.log(id);
    // });
    var clientIp = headers.getClientIP();
    var clientConnId = Meteor.connection._lastSessionId;
    console.log(clientIp);
    console.log(clientConnId);

    // Ips.findAndModify({
    //
    //     //Find the desired document based on specified criteria
    //     query: { "ipAdr": clientIp, connections: { $elemMatch: { connID: clientConnId}}},
    //
    //     //Update only the elements of the array where the specified criteria matches
    //     update: { $push: { 'connections.$.clicks': {clickedThis: clickedOne, clickedAt: new Date()} }}
    // });

    Meteor.call("updateDB", {clientIp,clientConnId,clickedOne}, function(error, result){
      if(error){
        console.log("error", error);
      }
      if(result){

      }
    });

  }
});

// Template.ip.onCreated(function functionName() {
// (function ($) {
//   $('.showHide').click(function () {
//     console.log('I log');
//         $(this).parent().next('conns').first().toggle();
//   });
// })(jQuery);
// });
