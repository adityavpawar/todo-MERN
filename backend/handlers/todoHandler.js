import Todo from "../models/Todo.js";

// Get all todos
export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: "Error fetching todos", error: err });
  }
};

// Add a new todo
export const addTodo = async (req, res) => {
  try {
    const { task } = req.body;
    const newTodo = await Todo.create({ task });
    res.json(newTodo);
  } catch (err) {
    res.status(500).json({ message: "Error adding todo", error: err });
  }
};

// Delete a todo
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    res.json({ message: "Task deleted", id });
  } catch (err) {
    res.status(500).json({ message: "Error deleting todo", error: err });
  }
};

// Toggle complete/uncomplete
export const toggleTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    if (!todo) return res.status(404).json({ message: "Task not found" });

    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: "Error toggling todo", error: err });
  }
};

// Update task text
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { task } = req.body;

    if (!task || task.trim() === "")
      return res.status(400).json({ message: "Task cannot be empty" });

    const updatedTodo = await Todo.findByIdAndUpdate(id, { task }, { new: true });
    if (!updatedTodo) return res.status(404).json({ message: "Task not found" });

    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ message: "Error updating todo", error: err });
  }
};
