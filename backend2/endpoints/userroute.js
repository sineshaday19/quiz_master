import express from 'express';

import bcrypt from 'bcrypt';
import { db_con } from '../connection/connection.js';

const userRouter = express.Router();

// Register new user
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       500:
 *         description: Registration failed
 */
userRouter.post("/register", async (req, res) => {
    try {
        const { username, email, password, first_name, last_name } = req.body;
        const hashed_password = await bcrypt.hash(password, 10);
        
        await db_con.query(
            "INSERT INTO `users`(`username`, `email`, `password_hash`, `first_name`, `last_name`) VALUES (?,?,?,?,?)", 
            [username, email, hashed_password, first_name, last_name]
        );
        
        return res.status(201).json({ "message": "User registered successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": "Registration failed" });
    }
});

// User login
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Login failed
 */
userRouter.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const [users] = await db_con.query("SELECT * FROM `users` WHERE `username`=?", [username]);
        
        if (users.length === 0) return res.status(401).json({ "error": "Invalid credentials" });
        
        const passwordMatch = await bcrypt.compare(password, users[0].password_hash);
        if (!passwordMatch) return res.status(401).json({ "error": "Invalid credentials" });
        
        // In a real app, you would generate a JWT token here
        return res.status(200).json({ 
            "message": "Login successful",
            "user": {
                "user_id": users[0].user_id,
                "is_admin":users[0].is_admin,
                "username": users[0].username,
                "email": users[0].email,
                "first_name": users[0].first_name,
                "last_name": users[0].last_name
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": "Login failed" });
    }
});

// Get all users (admin only)
userRouter.get("/", async (req, res) => {
    try {
        const [users] = await db_con.query("SELECT `user_id`, `username`, `email`, `first_name`, `last_name`, `created_at` FROM `users`");
        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": "Failed to fetch users" });
    }
});

// Update user
userRouter.put("/:id", async (req, res) => {
    try {
        const { username, email, first_name, last_name } = req.body;
        const { id } = req.params;
        
        await db_con.query(
            "UPDATE `users` SET `username`=?, `email`=?, `first_name`=?, `last_name`=? WHERE `user_id`=?", 
            [username, email, first_name, last_name, id]
        );
        
        return res.status(200).json({ "message": "User updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": "Update failed" });
    }
});

// Delete user
userRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db_con.query("DELETE FROM `users` WHERE `user_id`=?", [id]);
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": "Deletion failed" });
    }
});

export default userRouter;