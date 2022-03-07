import React from 'react';
import classNames from 'classnames';
import { useAppState, useActions } from '../overmind/Overmind';
import { pluralize } from '../utils';

const TodoFooter = () => {
  const state = useAppState();
  const actions = useActions();

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{state.activeTodoCount}</strong>{' '}
        {pluralize(state.activeTodoCount, 'item')} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="/"
            className={classNames({ selected: state.filter === 'all' })}
          >
            All
          </a>
        </li>{' '}
        <li>
          <a
            href="/active"
            className={classNames({ selected: state.filter === 'active' })}
          >
            Active
          </a>
        </li>{' '}
        <li>
          <a
            href="/completed"
            className={classNames({ selected: state.filter === 'completed' })}
          >
            Completed
          </a>
        </li>
      </ul>
      {state.hasCompletedTodos ? (
        <button
          className="clear-completed"
          onClick={() => actions.clearCompleted()}
        >
          Clear completed
        </button>
      ) : null}
    </footer>
  );
};

export default TodoFooter;
