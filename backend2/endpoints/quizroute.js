import express from 'express';
import { db_con } from '../connection/connection.js';

const quizRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: Quiz management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Quiz:
 *       type: object
 *       properties:
 *         quiz_id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "JavaScript Basics"
 *         description:
 *           type: string
 *           example: "Test your knowledge of JavaScript fundamentals"
 *         created_by:
 *           type: integer
 *           example: 1
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2023-05-15T10:00:00Z"
 *         time_limit_minutes:
 *           type: integer
 *           example: 30
 *         is_published:
 *           type: boolean
 *           example: true
 *         published_at:
 *           type: string
 *           format: date-time
 *           example: "2023-05-16T09:00:00Z"
 */

/**
 * @swagger
 * /quizzes:
 *   post:
 *     summary: Create a new quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Quiz'
 *             required:
 *               - title
 *               - created_by
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quiz created successfully"
 *                 quiz_id:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
quizRouter.post("/", async (req, res) => {
    try {
        const { title, description, created_by, time_limit_minutes } = req.body;
        
        if (!title || !created_by) {
            return res.status(400).json({ "error": "Title and created_by are required" });
        }
        
        const [result] = await db_con.query(
            "INSERT INTO `quizzes`(`title`, `description`, `created_by`, `time_limit_minutes`) VALUES (?,?,?,?)", 
            [title, description, created_by, time_limit_minutes]
        );
        
        return res.status(201).json({ 
            "message": "Quiz created successfully",
            "quiz_id": result.insertId
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": "Quiz creation failed" });
    }
});

/**
 * @swagger
 * /quizzes:
 *   get:
 *     summary: Get all quizzes
 *     tags: [Quizzes]
 *     responses:
 *       200:
 *         description: List of all quizzes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quiz'
 *       500:
 *         description: Server error
 */
quizRouter.get("/", async (req, res) => {
    try {
        const [quizzes] = await db_con.query("SELECT * FROM `quizzes`");
        return res.status(200).json(quizzes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": "Failed to fetch quizzes" });
    }
});

/**
 * @swagger
 * /quizzes/{id}:
 *   get:
 *     summary: Get a single quiz by ID
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The quiz ID
 *     responses:
 *       200:
 *         description: Quiz data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
quizRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [quiz] = await db_con.query("SELECT * FROM `quizzes` WHERE `quiz_id`=?", [id]);
        
        if (quiz.length === 0) return res.status(404).json({ "error": "Quiz not found" });
        
        return res.status(200).json(quiz[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": "Failed to fetch quiz" });
    }
});

/**
 * @swagger
 * /quizzes/{id}:
 *   put:
 *     summary: Update a quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               time_limit_minutes:
 *                 type: integer
 *               is_published:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Quiz updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quiz updated successfully"
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
quizRouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, time_limit_minutes, is_published } = req.body;
        
        // Check if quiz exists
        const [existing] = await db_con.query("SELECT * FROM `quizzes` WHERE `quiz_id`=?", [id]);
        if (existing.length === 0) return res.status(404).json({ "error": "Quiz not found" });
        
        await db_con.query(
            "UPDATE `quizzes` SET `title`=?, `description`=?, `time_limit_minutes`=?, `is_published`=? WHERE `quiz_id`=?", 
            [title, description, time_limit_minutes, is_published, id]
        );
        
        return res.status(200).json({ "message": "Quiz updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": "Update failed" });
    }
});

/**
 * @swagger
 * /quizzes/{id}:
 *   delete:
 *     summary: Delete a quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The quiz ID
 *     responses:
 *       204:
 *         description: Quiz deleted successfully
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
quizRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if quiz exists
        const [existing] = await db_con.query("SELECT * FROM `quizzes` WHERE `quiz_id`=?", [id]);
        if (existing.length === 0) return res.status(404).json({ "error": "Quiz not found" });
        
        await db_con.query("DELETE FROM `quizzes` WHERE `quiz_id`=?", [id]);
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": "Deletion failed" });
    }
});
/**
 * @swagger
 * /quizzes/unpublished:
 *   get:
 *     summary: Get all unpublished quizzes
 *     tags: [Quizzes]
 *     responses:
 *       200:
 *         description: List of unpublished quizzes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quiz'
 *       500:
 *         description: Server error
 */
quizRouter.get("/unpublished", async (req, res) => {
    try {
        const [quizzes] = await db_con.query("SELECT * FROM `quizzes` WHERE `is_published` = 0");
        return res.status(200).json(quizzes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": "Failed to fetch unpublished quizzes" });
    }
});
quizRouter.get("/", async (req, res) => {
    try {
        const { is_published } = req.query;

        let query = "SELECT * FROM `quizzes`";
        let params = [];

        if (typeof is_published !== 'undefined') {
            query += " WHERE `is_published` = ?";
            // Convert string "true"/"false" to 1/0 for MySQL
            params.push(is_published === 'true' ? 1 : 0);
        }

        const [quizzes] = await db_con.query(query, params);
        return res.status(200).json(quizzes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": "Failed to fetch quizzes" });
    }
});

export default quizRouter;