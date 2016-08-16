import { Template } from 'meteor/templating';
import "./body.html";

Template.body.helpers({
  tasks: [
    {text: 'text 1'},
    {text: 'text 2'},
    {text: 'text 3'},
  ],
});
