// ==========================================================================
// Project:   Todos.Todo
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Todos */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Todos.Todo = SC.Record.extend(
/** @scope Todos.Todo.prototype */ {

  title: SC.Record.attr(String),
  isDone: SC.Record.attr(Boolean),
}) ;
