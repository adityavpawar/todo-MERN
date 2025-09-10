import React, { useState, useEffect } from "react";
import axios from "axios";
import Create from "./Create";
import { BsCircleFill, BsFillTrashFill } from "react-icons/bs";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios
      .get(`${API_URL}/get`)
      .then((res) => setTodos(res.data))
      .catch((err) => console.error("Error fetching todos:", err));
  }, [API_URL]);

  const addTodo = (newTask) => setTodos((prev) => [...prev, newTask]);

  const deleteTodo = (id) => {
    axios
      .delete(`${API_URL}/delete/${id}`)
      .then(() => setTodos((prev) => prev.filter((todo) => todo._id !== id)))
      .catch((err) => console.error("Error deleting task:", err));
  };

  const toggleTodo = (id) => {
    axios
      .put(`${API_URL}/toggle/${id}`)
      .then((res) =>
        setTodos((prev) =>
          prev.map((todo) => (todo._id === id ? res.data : todo))
        )
      )
      .catch((err) => console.error("Error toggling task:", err));
  };

  const saveEdit = (id) => {
    axios
      .put(`${API_URL}/update/${id}`, { task: editText })
      .then((res) =>
        setTodos((prev) =>
          prev.map((todo) => (todo._id === id ? res.data : todo))
        )
      )
      .catch((err) => console.error("Error updating task:", err));
    setEditId(null);
    setEditText("");
  };

  return (
    <div className={`home ${darkMode ? "dark" : "light"}`}>
      {/* Top Bar */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "10px 20px",
        }}
      >
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            backgroundColor: darkMode ? "#fff" : "#333",
            color: darkMode ? "#333" : "#fff",
            fontWeight: "bold",
          }}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <h1>Todo List</h1>
      <Create onAdd={addTodo} />

      {todos.length === 0 ? (
        <h3>No Records</h3>
      ) : (
        todos.map((item) => (
          <div key={item._id} className="todo_item">
            <BsCircleFill
              className="icon-circle"
              style={{
                color: item.completed ? "green" : "#888",
                cursor: "pointer",
              }}
              onClick={() => toggleTodo(item._id)}
            />
            {editId === item._id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => saveEdit(item._id)}
                onKeyDown={(e) => e.key === "Enter" && saveEdit(item._id)}
                autoFocus
                style={{ flex: 1, marginLeft: 10, padding: 4 }}
              />
            ) : (
              <span
                className={`task-text ${item.completed ? "completed" : ""}`}
                onClick={() => {
                  setEditId(item._id);
                  setEditText(item.task);
                }}
              >
                {item.task}
              </span>
            )}
            <BsFillTrashFill
              className="icon-trash"
              onClick={() => deleteTodo(item._id)}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default Home;