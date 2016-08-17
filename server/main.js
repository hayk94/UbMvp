import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  console.log(Meteor.default_server.stream_server.all_sockets());
  Meteor.onConnection(function(conn){
    console.log(Meteor.default_server.stream_server.all_sockets());
    
    //  console.log(conn);
    // var userObject = {
    //   username: "testMe",
    //   mail: "test@test.com",
    //   password: "testPass"
    // };
    //
    // Accounts.createUser(userObject);
  });
});
