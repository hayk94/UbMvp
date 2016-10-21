import { Meteor } from 'meteor/meteor';

FlowRouter.route('/',{
  action: function () {
    BlazeLayout.render("mainLayout", {content: "home"});
  }
});

FlowRouter.route('/ips',{
  action: function () {
    BlazeLayout.render('mainLayout', {content:"ips"});
  }
});

FlowRouter.route('/ui',{
  action: function () {
    BlazeLayout.render('mainLayout', {content:"ui"});
  }
});


Tracker.autorun(function() {
    FlowRouter.watchPathChange();
    var context = FlowRouter.current();
    // use context to access the URL state
    console.log(context);
    var visitedOne = context.path;

    //getting the connID
    var clientIp = headers.getClientIP();
    var clientConnId = Meteor.connection._lastSessionId;
    console.log(clientIp);
    console.log(clientConnId);



    Meteor.call("updateHistory", {clientIp,clientConnId,visitedOne}, function(error, result){
     if(error){
       console.log("error", error);
     }
     if(result){

     }
    });//Meteor.call
});
