import express from "express";
import {
  getTodos,
  addTodo,
  deleteTodo,
  toggleTodo,
  updateTodo,
} from "../handlers/todoHandler.js";

const router = express.Router();

router.get("/get", getTodos);
router.post("/add", addTodo);
router.delete("/delete/:id", deleteTodo);
router.put("/toggle/:id", toggleTodo);
router.put("/update/:id", updateTodo);

export default router;
