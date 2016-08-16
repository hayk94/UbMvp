import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
  // var userObject = {
  //   username: "anotherTest",
  //   mail: "anotherTest@me.com",
  //   password: "testingME"
  // };
  //
  // Accounts.createUser(userObject, function(error){
  //    console.log('User created');
  //    console.log(error);
  // });
  // http://stackoverflow.com/questions/38974700/user-is-created-however-cannot-login-after-logging-out-meteorjs
        //   You're trying to use client side accounts management to perform a task it hasn't been designed for.
        //
        // Client side accounts package purpose is to specifically allow new users to create their account and expect to be logged in immediately.
        //
        // You have to remember that certain functions can be run on the client and/or on the server with different behaviors, Accounts.createUser docs specify that : "On the client, this function logs in as the newly created user on successful completion."
        //
        // On the contrary, "On the server, it returns the newly created user id." (it doesn't mess with the currently logged in user on the client).
        //
        // In order to solve your problem, you should write a server side method creating a new user and be able to call it from your client side admin panel, after filling correctly a user creation form of your own design.
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
