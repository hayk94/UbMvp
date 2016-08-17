import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  allConns = Meteor.default_server.stream_server.all_sockets();
    function objToString (obj) {
      var str = '';
      for (var p in obj) {
          if (obj.hasOwnProperty(p)) {
              str += p + '::' + obj[p] + '\n';
          }
      }
      return str;
    }
  console.log(allConns);
  Meteor.onConnection(function(conn){
    // console.log(allConns);
    //The array above is to big for the console let's convert it to string

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
