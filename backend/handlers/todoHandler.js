import Todo from "../models/Todo.js";

// Get all todos sorted by position
export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user }).sort("position"); //  sorted
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: "Error fetching todos", error: err });
  }
};

// Add a new todo with next position
export const addTodo = async (req, res) => {
  try {
    const { task } = req.body;

    // Find last position for this user
    const lastTodo = await Todo.findOne({ user: req.user }).sort("-position");

    const newTodo = await Todo.create({
      task,
      user: req.user,
      position: lastTodo ? lastTodo.position + 1 : 0, // 👈 set order
    });

    res.json(newTodo);
  } catch (err) {
    res.status(500).json({ message: "Error adding todo", error: err });
  }
};

// Delete a todo
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOneAndDelete({ _id: id, user: req.user });
    if (!todo) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted", id });
  } catch (err) {
    res.status(500).json({ message: "Error deleting todo", error: err });
  }
};

// Toggle complete/uncomplete
export const toggleTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({ _id: id, user: req.user });
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

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, user: req.user },
      { task },
      { new: true }
    );
    if (!updatedTodo) return res.status(404).json({ message: "Task not found" });

    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ message: "Error updating todo", error: err });
  }
};

// NEW: reorder todos
export const reorderTodos = async (req, res) => {
  try {
    const { orderedIds } = req.body; // array of todo IDs in new order

    await Promise.all(
      orderedIds.map((id, index) =>
        Todo.findOneAndUpdate(
          { _id: id, user: req.user },
          { position: index } // update position
        )
      )
    );

    res.json({ message: "Reordered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error reordering todos", error: err });
  }
};