import { z } from "zod";

export const signupSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
    }),
});

export const verifyOtpSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        otp: z.string().length(6, "OTP must be 6 characters long"),
    }),
});

export const createTaskSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
        status: z.enum(["ToDo", "InProgress", "Done"]).optional(),
    }),
});

export const updateTaskSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Task ID is required"),
    }),
    body: z.object({
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        status: z.enum(["ToDo", "InProgress", "Done"]).optional(),
        order: z.number().optional(),
    }),
});

export const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().min(2).optional(),
        age: z.union([z.number().min(8).max(120), z.null(), z.literal('')]).optional(),
        socialHandles: z.object({
            github: z.string().optional().or(z.literal('')),
            codeforces: z.string().optional().or(z.literal('')),
            leetcode: z.string().optional().or(z.literal('')),
            linkedin: z.string().optional().or(z.literal('')),
        }).optional(),
    }),
});

export const createPostSchema = z.object({
    body: z.object({
        title: z.string().min(5, "Title must be at least 5 characters long"),
        content: z.string().min(10, "Content must be at least 10 characters long"),
    }),
});
