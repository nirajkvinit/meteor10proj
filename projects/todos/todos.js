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

      Todos.insert({
        text: text,
        createdAt: new Date()
      });
      event.target.text.value = "";
      return false;
    },
    "click .toggle-checked": function(){
      Todos.update(this._id, {$set: {checked: !this.checked}});
    },
    "click .delete-todo": function(){
      if(confirm("Are you sure?")) {
        Todos.remove(this._id);        
      }      
    }
  });
}

if (Meteor.isServer) {
  
}
