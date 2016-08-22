import { Meteor } from 'meteor/meteor';

FlowRouter.route('/',{
  action: function () {
    BlazeLayout.render("mainLayout", {content: "home"});
  }
});

// FlowRouter.route('/:postId',{
//   action: function () {
//     BlazeLayout.render('body', {content:"blogPost"});
//   }
// })
FlowRouter.route('/ips',{
  action: function () {
    BlazeLayout.render('mainLayout', {content:"ips"});
  }
})

Tracker.autorun(function() {
    FlowRouter.watchPathChange();
    var context = FlowRouter.current();
    // use context to access the URL state
    // console.log(window.location.href);
    console.log(context);
    // console.log(window.location.hash);
    var visitedOne = context.path;
    // console.log(window.location.href);
    //getting the connID

    var clientIp = headers.getClientIP(); // no need for this anymore
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
