import React, { useState } from "react";
import API from "../api";

const Create = ({ onAdd }) => {
  const [task, setTask] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!task.trim()) {
      alert("Task cannot be empty");
      return;
    }

    try {
      const res = await API.post("/todos/add", { task });
      setTask("");
      onAdd(res.data); // Add new todo to state
    } catch (err) {
      console.error("Error saving task:", err);
      if (err.response?.status === 401) {
        alert("You must be logged in to add a task");
        window.location.href = "/login";
      } else {
        alert("Error adding task");
      }
    }
  };

  return (
    <form className="create_form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter a task"
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default Create;