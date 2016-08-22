import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Tasks } from '../api/tasks.js';
import { Conns } from '../api/conns.js';
import { Ips } from '../api/ips.js';

import "./body.html";

// Template.body.helpers({
//   // tasks(){
//   //   return Tasks.find({});
//   // },
//   // conns(){
//   //   return JSON.stringify(Conns.find({},{ sort: { createdAt: -1 } }),undefined,2);
//   // },
//   ips(){
//     // console.log(Ips.find({},{sort: { createdAt: -1 } }).fetch());
//     return JSON.stringify(Ips.find({},{sort: { createdAt: -1 } }).fetch(),undefined,2);
//
//     // return Ips.find({},{sort: { createdAt: -1 } });
//   },
// });
FlowRouter.wait();
Meteor.startup(function() {
    FlowRouter.initialize({ hashbang: true });
});
Template.ips.helpers({
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

Template.ip.events({
  "click .showHide": function(event, template){
    console.log('I log');
    // console.log($(this));// this is the whole template
    console.log(event.target);
    $(function() {
       // your jQuery code here...

       $(event.target).next('.conns').toggle(500); //event.target is the event emitter
   });
 }//.showHide clicks

});//Template.ip.events



Template.body.events({
  "click *": function(event, template){
     event.stopPropagation();
     console.log('body all click log');
    //  console.log(c0nnIp);
     var clickedOne = $(event.target).html().toString();
     console.log('This click ' + clickedOne);
     //getting the connID

    var clientIp = headers.getClientIP();
    var clientConnId = Meteor.connection._lastSessionId;
    console.log(clientIp);
    console.log(clientConnId);



    Meteor.call("updateDB", {clientIp,clientConnId,clickedOne}, function(error, result){
      if(error){
        console.log("error", error);
      }
      if(result){

      }
    });

  }, // click *

  //stopping the default link behavior, otherwise every link click is a new connection
  // "click a": function (event, template) {
  //   event.preventDefault();
  // }
});



// //routing
// FlowRouter.route('/test',{
//   name: 'testPost',
//   action: function (params) {
//     console.log('This is my blog post:', params.postId);
//   }
// });
