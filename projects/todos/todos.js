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
    "submit .new-todo": function(event){      
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

// Server code
if (Meteor.isServer) {
  Meteor.publish('todos', function(){
    if(this.userId) {
      return Todos.find({userId: this.userId});
    } else {
      return Todos.find();
    }
    
  });
}

//Meteor Methods
Meteor.methods({
  addTodo: function(text){
    if(!Meteor.userId()) {
      throw new Meteor.Error('Not authorized');
    }
    Todos.insert({
        text: text,
        createdAt: new Date(),
        userId: Meteor.userId(),
        username: Meteor.user().username
      });
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



