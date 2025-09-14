import React, { useState, useEffect } from "react";
import API from "../api";
import Create from "./Create";
import { BsCircleFill, BsFillTrashFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [theme, setTheme] = useState("light");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const navigate = useNavigate();

  // Fetch todos
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await API.get("/todos/get");
        setTodos(res.data);
      } catch (err) {
        console.error("Error fetching todos:", err);
        if (err.response?.status === 401) navigate("/login");
      }
    };
    fetchTodos();
  }, [navigate]);

  // Add new todo
  const handleAdd = (newTodo) => {
    setTodos((prev) => [...prev, newTodo]);
  };

  // Toggle complete
  const handleToggle = async (id) => {
    try {
      const res = await API.put(`/todos/toggle/${id}`);
      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? res.data : todo))
      );
    } catch (err) {
      console.error("Error toggling todo:", err);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  // Delete todo
  const handleDelete = async (id) => {
    try {
      await API.delete(`/todos/delete/${id}`);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  // Start editing a task
  const handleEditStart = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  // Update task
  const handleEditSubmit = async (id) => {
    try {
      const res = await API.put(`/todos/update/${id}`, { task: editingText });
      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? res.data : todo))
      );
      setEditingId(null);
      setEditingText("");
    } catch (err) {
      console.error("Error updating todo:", err);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  // Theme toggle
  const toggleTheme = () => {
    setTheme((prev) =>
      prev === "light" ? "dark" : prev === "dark" ? "black" : "light"
    );
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 👇 NEW: drag and drop handler
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const reordered = Array.from(todos);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    // Update UI instantly
    setTodos(reordered);

    // Send new order to backend
    try {
      await API.put("/todos/reorder", {
        orderedIds: reordered.map((t) => t._id),
      });
    } catch (err) {
      console.error("Error reordering todos:", err);
    }
  };

  return (
    <div className={`home ${theme}`}>
      {/* Top-right buttons */}
      <div className="top-right">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light"
            ? "🌙 Dark"
            : theme === "dark"
            ? "🖤 Black"
            : "☀️ Light"}
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <h1>My Todo List</h1>

      {/* Create form */}
      <Create onAdd={handleAdd} />

      {/* 👇 DragDropContext wraps todos */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {todos.map((todo, index) => (
                <Draggable key={todo._id} draggableId={todo._id} index={index}>
                  {(provided) => (
                    <div
                      className="todo_item"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <BsCircleFill
                        className={`icon-circle ${
                          todo.completed ? "completed" : ""
                        }`}
                        onClick={() => handleToggle(todo._id)}
                      />
                      {editingId === todo._id ? (
                        <input
                          className="task-text edit-input"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onBlur={() => handleEditSubmit(todo._id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleEditSubmit(todo._id);
                          }}
                          autoFocus
                        />
                      ) : (
                        <span
                          className={`task-text ${
                            todo.completed ? "completed" : ""
                          }`}
                          onDoubleClick={() =>
                            handleEditStart(todo._id, todo.task)
                          }
                        >
                          {todo.task}
                        </span>
                      )}
                      <BsFillTrashFill
                        className="icon-trash"
                        onClick={() => handleDelete(todo._id)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Home;














