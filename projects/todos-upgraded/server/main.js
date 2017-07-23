import { Meteor } from 'meteor/meteor';

Todos = new Mongo.Collection('todos');

Meteor.startup(() => {
  // code to run on server at startup
  Meteor.publish('todos', function(){
    if(this.userId) {
      return Todos.find({userId: this.userId});
    } else {
      //return Todos.find();
    }
  });
});

//Meteor Methods
Meteor.methods({
  addTodo: function(text){
    if(!Meteor.userId()) {
      throw new Meteor.Error('Not authorized');
    }

    if(text.length > 0) {
      Todos.insert({
          text: text,
          createdAt: new Date(),
          userId: Meteor.userId(),
          username: Meteor.user().username
      });
    }
  },

  deleteTodo: function(todoId){
      var todo = Todos.findOne(todoId);
      if(todo.userId !== Meteor.userId()) {
        throw Meteor.Error('not-authorized');
      }
      Todos.remove(todoId);
  },

  setChecked: function(todoId, setChecked){
      var todo = Todos.findOne(todoId);
      if(todo.userId !== Meteor.userId()) {
        throw new Meteor.Error('Not authorized');
      }
      Todos.update(todoId, {$set: {checked: setChecked}})
  }
});
