import { Request, Response } from "express";
import Task from "../models/task.model";

// Get all tasks for a user
export const getTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user._id;
        const tasks = await Task.find({ userId }).sort({ order: 1 });
        res.json(tasks);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

// Create a new task
export const createTask = async (req: Request, res: Response): Promise<void> => {
    
    try {
        const userId = (req as any).user._id;
        const { title, description, status, priority } = req.body;

        // Get max order for the status to append to end
        const lastTask = await Task.findOne({ userId, status }).sort({ order: -1 });
        const order = lastTask ? lastTask.order + 1 : 0;

        const task = await Task.create({
            userId,
            title,
            description,
            status,
            priority,
            order,
        });

        res.status(201).json(task);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

// Update task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = (req as any).user._id;
        const updates = req.body;

        const task = await Task.findOneAndUpdate({ _id: id, userId }, updates, { new: true });

        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }

        res.json(task);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

// Delete task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = (req as any).user._id;

        const task = await Task.findOneAndDelete({ _id: id, userId });

        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }

        res.json({ message: "Task deleted" });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};

// Update task order (Drag and Drop)
export const updateTaskOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user._id;
        const { tasks } = req.body; // Array of { _id, status, order }

        if (!Array.isArray(tasks)) {
            res.status(400).json({ message: "Invalid data format" });
            return;
        }

        const bulkOps = tasks.map((task: any) => ({
            updateOne: {
                filter: { _id: task._id, userId },
                update: { status: task.status, order: task.order },
            },
        }));

        await Task.bulkWrite(bulkOps);

        res.json({ message: "Tasks updated" });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
};
