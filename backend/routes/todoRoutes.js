import express from "express";
import {
  getTodos,
  addTodo,
  deleteTodo,
  toggleTodo,
  updateTodo,
  reorderTodos,
} from "../handlers/todoHandler.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// All todo routes are protected
router.get("/get", authMiddleware, getTodos);
router.post("/add", authMiddleware, addTodo);
router.delete("/delete/:id", authMiddleware, deleteTodo);
router.put("/toggle/:id", authMiddleware, toggleTodo);
router.put("/update/:id", authMiddleware, updateTodo);
router.put("/reorder", authMiddleware, reorderTodos);
export default router;