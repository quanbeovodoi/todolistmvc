import React, { useEffect } from 'react';
import { useAppState, useActions } from '../overmind/Overmind';

import TodoItem from './TodoItem';
import TodoFooter from './TodoFooter';

const TodoApp = () => {
  const state = useAppState();
  const actions = useActions();
  console.log(state.currentTodos)
  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={state.newTodoTitle}
          onChange={(event) =>
            actions.changeNewTodoTitle(event.currentTarget.value)
          }
          onKeyDown={(event) => {
            if (event.keyCode !== 13) return;
            actions.addTodo();
          }}
        />
      </header>
      <section className="main">
        {/* <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          onChange={() => actions.toggleAllTodos()}
          checked={state.isAllTodosChecked}
        />
        <label htmlFor="toggle-all">Mark all as complete</label> */}
        <ul className="todo-list">
          {state.currentTodos.map((todo) => {
            return <TodoItem key={todo.id} id={todo.id} />;
          })}
        </ul>
      </section>
      {
      state.currentTodos.length!=0?<TodoFooter />:<></>
      }
      
    </div>
  );
};

export default TodoApp;
