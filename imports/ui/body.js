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

Template.ip.events({
  "click .showHide": function(event, template){
    console.log('I log');
    console.log($(this));
     $(this).parent().next('conns').first().toggle();
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
