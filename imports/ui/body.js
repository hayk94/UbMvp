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
    return Conns.find({},{ sort: { createdAt: -1 } });
  },
  ips(){
    console.log(Ips.find({},{sort: { createdAt: -1 } }).fetch());
    return Ips.find({},{sort: { createdAt: -1 } });
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
     console.log('This click' + $(event.target).html().toString());
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
