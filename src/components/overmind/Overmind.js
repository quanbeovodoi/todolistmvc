import { createOvermind, derived } from 'overmind';
import { createStateHook, createActionsHook } from 'overmind-react';
import page from 'page';

export const useAppState = createStateHook();
export const useActions = createActionsHook();

export const overmind = createOvermind(
  {
    state: {
      filter: 'all',
      newTodoTitle: '',
      todos: {},
      currentTodos: derived(({ todos, filter }) => {
        return Object.values(todos).filter((todo) => {
          switch (filter) {
            case 'active':
              return !todo.completed;
            case 'completed':
              return todo.completed;
            default:
              return true;
          }
        });
      }),
      activeTodoCount: derived(({ todos }) => {
        return Object.values(todos).filter((todo) => !todo.completed).length;
      }),
      hasCompletedTodos: derived(({ todos }) => {
        return Object.values(todos).some((todo) => todo.completed);
      }),
      isAllTodosChecked: derived(({ currentTodos }) => {
        return currentTodos.every((todo) => todo.completed);
      }),
    },
    actions: {
      onInitializeOvermind({ state, actions, effects }, instance) {
        state.todos = effects.storage.getTodos();

        instance.reaction(
          ({ todos }) => todos,
          (todos) => effects.storage.saveTodos(todos),
          { nested: true }
        );

        effects.router.initialize({
          '/': () => actions.changeFilter('all'),
          '/active': () => actions.changeFilter('active'),
          '/completed': () => actions.changeFilter('completed'),
        });
      },
      changeNewTodoTitle({ state }, title) {
        state.newTodoTitle = title;
      },
      addTodo({ state, effects }) {
        const id = effects.ids.create();

        state.todos[id] = {
          id,
          title: state.newTodoTitle,
          completed: false,
          isEditing: false,
          editedTitle: state.newTodoTitle,
        };

        state.newTodoTitle = '';

        if (state.filter === 'completed') {
          effects.router.goTo('/active');
        }
      },
      toggleTodo({ state }, todoId) {
        state.todos[todoId].completed = !state.todos[todoId].completed;
      },
      toggleAllTodos({ state }) {
        const isAllChecked = state.isAllTodosChecked;

        state.currentTodos.forEach((todo) => {
          todo.completed = !isAllChecked;
        });
      },
      removeTodo({ state }, todoId) {
        delete state.todos[todoId];
      },
      clearCompleted({ state }) {
        Object.values(state.todos).forEach((todo) => {
          if (todo.completed) {
            delete state.todos[todo.id];
          }
        });
      },
      changeEditingTodoTitle({ state }, { title, todoId }) {
        state.todos[todoId].editedTitle = title;
      },
      saveEditingTodoTitle({ state }, todoId) {
        const todo = state.todos[todoId];
        if (todo.isEditing) {
          todo.title = todo.editedTitle;
          todo.isEditing = false;
        }
      },
      editTodo({ state }, todoId) {
        const todo = state.todos[todoId];
        todo.isEditing = true;
        todo.editedTitle = todo.title;
      },
      cancelEditingTodo({ state }, todoId) {
        state.todos[todoId].isEditing = false;
      },
      changeFilter({ state }, filter) {
        state.filter = filter;
      },
    },
    effects: {
      storage: {
        saveTodos(todos) {
          localStorage.setItem('todos', JSON.stringify(todos));
        },
        getTodos() {
          return JSON.parse(localStorage.getItem('todos') || '{}');
        },
      },
      router: {
        initialize(routes) {
          Object.keys(routes).forEach((url) => {
            page(url, ({ params }) => routes[url](params));
          });
          page.start();
        },
        goTo(url) {
          page.show(url);
        },
      },
      ids: {
        create() {
          return Date.now().toString();
        },
      },
    },
  },
  {
    devtools: false,
  }
);
