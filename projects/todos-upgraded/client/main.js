/*import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
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
*/

Todos = new Mongo.Collection('todos');

if (Meteor.isClient) {

  Meteor.subscribe('todos');

  // Template Helpers
  Template.main.helpers({
    todos: function(){
      return Todos.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.main.events({
    "submit .new-todo": function(event, template){

      var text = event.target.text.value;
      Meteor.call('addTodo', text);
      event.target.text.value = "";
      return false;

    },

    "click .toggle-checked": function(){
      //Todos.update(this._id, {$set: {checked: !this.checked}});
      Meteor.call('setChecked', this._id, !this.checked);
    },

    "click .delete-todo": function(){
      if(confirm("Are you sure?")) {
        //Todos.remove(this._id);
        Meteor.call('deleteTodo', this._id);
      }
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}
