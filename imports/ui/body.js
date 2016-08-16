import { Template } from 'meteor/templating';

import { Tasks } from '../api/tasks.js';
import { Conns } from '../api/conns.js';

import "./body.html";

Template.body.helpers({
  tasks(){
    return Tasks.find({});
  },
  conns(){
    return Conns.find({},{ sort: { createdAt: -1 } });
  },
});
