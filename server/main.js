import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  Meteor.onConnection(function(conn){
    //  console.log(conn);
    
  });
});
