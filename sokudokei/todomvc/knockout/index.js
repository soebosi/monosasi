ko.bindingHandlers.enterKey = {
  init: function( element, valueAccessor, allBindings, viewModel) {
    var callback = valueAccessor();
    element.addEventListener('keypress', function(event) {
      var keyCode = event.keyCode;
      if (keyCode === 13) {
        callback.call(viewModel);
        return false;
      }
      return true;
    });
  },
  update: function(element, valueAccessor, allBindings) {
  },
};

var Todo = function(title) {
  this.title = title;
  this.completed = ko.observable(false);
};

var TodoViewModel = function (items) {
  var self = this;
  this.todos = ko.observableArray(items);
  this.todoToAdd = ko.observable('');
  this.add = function() {
    self.todos.push(new Todo(self.todoToAdd()));
    self.todoToAdd('');
  };
  this.remove = function() {
    self.todos.remove(this);
  };
  this.completedCount = ko.computed(function() {
    var ret = 0;
    self.todos().forEach(function(todo) {
      if (todo.completed()) {
        ret++;
      }
    });
    return ret;
  });
  this.remainingCount = ko.computed(function() {
    return self.todos().length - self.completedCount();
  });
  this.allCompleted = ko.computed({
    read: function() {
      return !self.remainingCount();
    },
    write: function(newValue) {
      self.todos().forEach(function(todo) {
        todo.completed(newValue);
      });
    },
  });
  this.removeCompleted = function() {
    self.todos.remove(function(todo) {
      return todo.completed();
    });
  };
  this.getLabel = function(count) {
    return ko.utils.unwrapObservable(count) === 1 ? 'item' : 'items';
  };
};
ko.applyBindings(new TodoViewModel());
