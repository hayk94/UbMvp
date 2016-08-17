import { Meteor } from 'meteor/meteor';

import { Conns } from  '../imports/api/conns.js';

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
    allConns = Meteor.default_server.stream_server.all_sockets();
    console.log(allConns);
    //The array above is too big for the console let's convert it to string

    var allConsStr = objToString(allConns); // this returns a string with the unique id
      // var allConsStr = JSON.stringify(Meteor.default_server.stream_server.all_sockets());
      // var allConsStr =allConns.j;
      var currConStr = objToString(conn);
    console.log(allConsStr);
    console.log('Current CONN : ', conn);
    console.log('Curr CONN STR : ',currConStr);
    console.log('Current CONN END');
    Conns.insert({
            allConsStr,
            createdAt: new Date(),
          });
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
