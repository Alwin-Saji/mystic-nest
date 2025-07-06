import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Check, Trash2 } from "lucide-react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TodoPanel({ isOpen, onClose }: TodoPanelProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem("focus-todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem("focus-todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
      };
      setTodos([...todos, todo]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTodo();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold">To-Do List</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-accent transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Add Todo Form */}
            <div className="p-6 border-b border-border">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-1 px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-focus-primary"
                />
                <button
                  type="submit"
                  className="p-2 bg-focus-primary text-white rounded-md hover:bg-focus-primary/90 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </form>
            </div>

            {/* Todo List */}
            <div className="flex-1 overflow-y-auto p-6">
              {todos.length === 0 ? (
                <p className="text-muted-foreground text-center mt-8">
                  No tasks yet. Add one above!
                </p>
              ) : (
                <div className="space-y-3">
                  {todos.map((todo) => (
                    <motion.div
                      key={todo.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-3 p-3 rounded-md bg-accent/30 border border-border"
                    >
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={`p-1 rounded-full transition-all duration-200 ${
                          todo.completed
                            ? "bg-focus-success text-white"
                            : "border-2 border-border hover:border-focus-success"
                        }`}
                      >
                        {todo.completed && <Check className="h-3 w-3" />}
                      </button>
                      <span
                        className={`flex-1 ${
                          todo.completed
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {todo.text}
                      </span>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
