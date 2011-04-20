// ==========================================================================
// Project:   Todos
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Todos */

Todos = SC.Application.create({
  store: SC.Store.create().from(SC.Record.fixtures)
});

Todos.Todo = SC.Record.extend({
  title: SC.Record.attr(String),
  isDone: SC.Record.attr(Boolean),
});

Todos.Todo.FIXTURES = [
  { guid: 1, title: "Make this more dynamic", isDone: false },
  { guid: 2, title: "Add search functionality", isDone: false }
];

Todos.searchController = SC.Object.create({
  query: null
});

Todos.todoListController = SC.ArrayController.create({
  
  searchFieldBinding: 'Todos.searchController.query',

  searchFieldObserver: function() {
    var content, searchFieldValue, searchQuery;
    
    content = this.get('content');
    if(content) content.destroy();

    searchFieldValue = this.get('searchField');
    if(searchFieldValue) {
      searchQuery = SC.Query.local(Todos.Todo, { 
        conditions: 'title CONTAINS {searchString}', 
        parameters: { searchString: searchFieldValue }
      });
      
    } else {
      searchQuery = SC.Query.local(Todos.Todo);
    }
    
    this.set('content', Todos.store.find(searchQuery));      

  }.observes('searchField'),

  createTodo: function(title) {
    Todos.store.createRecord(Todos.Todo, { title: title, isDone: false });
  },

  remaining: function() {
    return this.filterProperty('isDone', false).get('length');
  }.property('@each.isDone'),

  clearCompletedTodos: function() {
    this.filterProperty('isDone', true).forEach(this.destroy, this);
  },

  allAreDone: function(key, value) {
    if (value !== undefined) {
      this.setEach('isDone', value);
      return value;
    } else {
      return this.get('length') && this.everyProperty('isDone', true);
    }
  }.property('@each.isDone')
});

Todos.createTodoView = SC.TemplateView.create(SC.TextFieldSupport, {
  insertNewline: function() {
    var value = this.get('value');

    Todos.todoListController.createTodo(value);
    this.set('value', '');
  }
});

Todos.searchTodoView = SC.TemplateView.create(SC.TextFieldSupport, {
  insertNewline: function() {
    var value = this.get('value');

    if (value) {
      Todos.searchController.set('query', value);
    }
  }
});


Todos.clearCompletedView = SC.TemplateView.create({
  mouseUp: function() {
    Todos.todoListController.clearCompletedTodos();
  }
});

Todos.todoListView = SC.TemplateCollectionView.create({
  contentBinding: 'Todos.todoListController'
});

Todos.CheckboxView = SC.TemplateView.extend(SC.CheckboxSupport, {
  valueBinding: '.parentView.content.isDone'
});

Todos.statsView = SC.TemplateView.create({
  remainingBinding: 'Todos.todoListController.remaining',

  displayRemaining: function() {
    var remaining = this.get('remaining');

    return remaining + (remaining === 1 ? " item" : " items");
  }.property('remaining').cacheable()
});

Todos.markAllDoneView = SC.TemplateView.create(SC.CheckboxSupport, {
  valueBinding: 'Todos.todoListController.allAreDone'
});

SC.ready(function() {
  Todos.mainPane = SC.TemplatePane.append({
    layerId: 'todos',
    templateName: 'todos'
  });
});
