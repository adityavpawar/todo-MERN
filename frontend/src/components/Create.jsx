import React, { useState } from "react";
import axios from "axios";

const Create = ({ onAdd }) => {
  const [task, setTask] = useState("");
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!task.trim()) {
      alert("Task cannot be empty");
      return;
    }

    axios
      .post(`${API_URL}/add`, { task })
      .then((res) => {
        setTask("");
        onAdd(res.data);
      })
      .catch((err) => console.error("Error saving task:", err));
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