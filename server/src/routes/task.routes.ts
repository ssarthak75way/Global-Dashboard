import express from "express";
import { getTasks, createTask, updateTask, deleteTask, updateTaskOrder } from "../controllers/task.controller";
import { protect } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createTaskSchema, updateTaskSchema } from "../validations/schema";

const router = express.Router();

router.use(protect); // protect all task routes

router.get("/", getTasks);
router.post("/", validate(createTaskSchema), createTask);
router.put("/reorder", updateTaskOrder); // Specific route before generic :id
router.put("/:id", validate(updateTaskSchema), updateTask);
router.delete("/:id", deleteTask);

export default router;
