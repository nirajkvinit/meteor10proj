Todos = new Mongo.Collection('todos');

if (Meteor.isClient) {  
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
    Todos.remove(todoId);
  },
  setChecked: function(todoId, setChecked){
    Todos.update(todoId, {$set: {checked: setChecked}})
  }
});

if (Meteor.isServer) {
  
}

