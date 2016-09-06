import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Tasks } from '../api/tasks.js';
import { Conns } from '../api/conns.js';
import { Ips } from '../api/ips.js';

import "./body.html";

Template.body.helpers({

});

Template.ips.helpers({
  ips(){
    // console.log(Ips.find({},{sort: { createdAt: -1 } }).fetch());
    return JSON.stringify(Ips.find({},{sort: { createdAt: -1 } }).fetch(),undefined,2);

    // return Ips.find({},{sort: { createdAt: -1 } });
  },
});

//MAKING THE UI


Template.ui.helpers({
  ips(){
    //  var Ips =
     console.log(Ips.find({},{sort: { createdAt: -1 } }));
    return Ips.find({},{sort: { createdAt: -1 } });
  },
});



//MAKING THE UI END

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



Template.mainLayout.events({
  "click *": function(event, template){
    // console.log($(event.target));
    if ( !($(event.target).hasClass('link')) ) {
      event.stopPropagation();
    }
    //  event.stopPropagation();
    // console.log(ActiveRoute.path('/home'));
     console.log('body all click log');
    //  console.log(c0nnIp);
     var clickedOne = $(event.target).html().toString();
     console.log('This click ' + clickedOne);
     //getting the connID

    var clientIp = headers.getClientIP(); // no need for this anymore
    var clientConnId = Meteor.connection._lastSessionId;
    console.log(clientIp);
    console.log('clientConnId'.clientConnId);



    Meteor.call("updateDB", {clientIp,clientConnId,clickedOne}, function(error, result){
      if(error){
        console.log("error", error);
      }
      if(result){

      }
    });

  }, // click *
});//events

// Template.body.events({
//   "click *": function(event, template){
//      event.stopPropagation();
//      console.log('body all click log');
//     //  console.log(c0nnIp);
//      var clickedOne = $(event.target).html().toString();
//      console.log('This click ' + clickedOne);
//      //getting the connID
//
//     var clientIp = headers.getClientIP();
//     var clientConnId = Meteor.connection._lastSessionId;
//     console.log(clientIp);
//     console.log(clientConnId);
//
//
//
//     Meteor.call("updateDB", {clientIp,clientConnId,clickedOne}, function(error, result){
//       if(error){
//         console.log("erro/ipsr", error);
//       }
//       if(result){
//
//       }
//     });
//
//   }, // click *
// });//events



// //routing
// FlowRouter.route('/test',{
//   name: 'testPost',
//   action: function (params) {
//     console.log('This is my blog post:', params.postId);
//   }
// });

// Template.onCreated(function () {
//   console.log('dynamic tempa changed');
//   console.log(window.location.href);
// });

Template.mainLayout.onCreated(function () {
  console.log("mainLayout created");
  var context = FlowRouter.current();
  // use context to access the URL state
  console.log(context);
  var visitedOne = context.path;

  //getting the connID
  var clientConnId;
  var clientIp = headers.getClientIP(); // no need for this anymore
  var connIdInterval = Meteor.setInterval(function () {
    console.log('interval');
    if (Meteor.connection._lastSessionId) {
      clientConnId = Meteor.connection._lastSessionId;
      Meteor.clearInterval(connIdInterval);
      console.log(clientIp);
      console.log('clienetConnId', clientConnId);
      // console.log(Meteor.connection._lastSessionId);



      Meteor.call("updateHistory", {clientIp,clientConnId,visitedOne}, function(error, result){
       if(error){
         console.log("error", error);
       }
       if(result){

       }
      });//Meteor.call
    }
  }, 300);

});
