import React from 'react';
import classNames from 'classnames';
import { useAppState, useActions } from '../overmind/Overmind';

const TodoItem = ({ id }) => {
  const todo = useAppState((state) => state.todos[id]);
  const actions = useActions();

  return (
    <li
      className={classNames({
        completed: todo.completed,
        editing: todo.isEditing,
      })}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => actions.toggleTodo(todo.id)}
        />
        <label onDoubleClick={() => actions.editTodo(todo.id)}>
          {todo.title}
        </label>
        <button
          className="destroy"
          onClick={() => actions.removeTodo(todo.id)}
        />
      </div>
      {todo.isEditing ? (
        <input
          className="edit"
          value={todo.editedTitle}
          onBlur={() => actions.saveEditingTodoTitle(todo.id)}
          onChange={(event) =>
            actions.changeEditingTodoTitle({
              title: event.currentTarget.value,
              todoId: todo.id,
            })
          }
          onKeyDown={(event) => {
            if (event.keyCode === 27) {
              actions.cancelEditingTodo(todo.id);
            } else if (event.keyCode === 13) {
              actions.saveEditingTodoTitle(todo.id);
            }
          }}
        />
      ) : null}
    </li>
  );
};

export default TodoItem;
