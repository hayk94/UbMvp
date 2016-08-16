import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  Meteor.onConnection(function(conn){
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
