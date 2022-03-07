import TodoApp from "./components/todolist/TodoApp";
import { Provider } from "overmind-react";
import { overmind } from "./components/overmind/Overmind";
import "./App.css"

function App() {
  return (
    <div className="todoapp">
      <Provider value={overmind}>
        <TodoApp />
      </Provider>
    </div>
  );
}

export default App;
