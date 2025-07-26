import express from 'express';
import { db_con } from '../connection/connection.js';

const questionRouter = express.Router();

// Add question to quiz
/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Question management
 */

/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Add question to quiz
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quiz_id
 *               - question_text
 *               - question_type
 *               - display_order
 *             properties:
 *               quiz_id:
 *                 type: integer
 *               question_text:
 *                 type: string
 *               question_type:
 *                 type: string
 *                 enum: [multiple_choice, true_false, short_answer, essay]
 *               points:
 *                 type: integer
 *                 default: 1
 *               display_order:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Question added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 question_id:
 *                   type: integer
 *       500:
 *         description: Failed to add question
 */
questionRouter.post("/", async (req, res) => {
    try {
        const { quiz_id, question_text, question_type, points, display_order } = req.body;
        
        const [result] = await db_con.query(
            "INSERT INTO `questions`(`quiz_id`, `question_text`, `question_type`, `points`, `display_order`) VALUES (?,?,?,?,?)", 
            [quiz_id, question_text, question_type, points, display_order]
        );
        
        return res.status(201).json({ 
            "message": "Question added successfully",
            "question_id": result.insertId
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": "Failed to add question" });
    }
});

// Get all questions for a quiz
questionRouter.get("/quiz/:quiz_id", async (req, res) => {
    try {
        const { quiz_id } = req.params;
        const [questions] = await db_con.query(
            "SELECT * FROM `questions` WHERE `quiz_id`=? ORDER BY `display_order`", 
            [quiz_id]
        );
        
        return res.status(200).json(questions);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": "Failed to fetch questions" });
    }
});

// Get a single question by ID
questionRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [question] = await db_con.query(
            "SELECT * FROM `questions` WHERE `question_id`=?", 
            [id]
        );
        
        if (question.length === 0) {
            return res.status(404).json({ "error": "Question not found" });
        }
        
        return res.status(200).json(question[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": "Failed to fetch question" });
    }
});

// Update question
questionRouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { question_text, question_type, points, display_order } = req.body;
        
        await db_con.query(
            "UPDATE `questions` SET `question_text`=?, `question_type`=?, `points`=?, `display_order`=? WHERE `question_id`=?", 
            [question_text, question_type, points, display_order, id]
        );
        
        return res.status(200).json({ "message": "Question updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": "Update failed" });
    }
});

// Delete question
questionRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db_con.query("DELETE FROM `questions` WHERE `question_id`=?", [id]);
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": "Deletion failed" });
    }
});

// Question Options CRUD

/**
 * @swagger
 * /questions/{question_id}/options:
 *   post:
 *     summary: Add option to multiple choice question
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: question_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - option_text
 *               - is_correct
 *             properties:
 *               option_text:
 *                 type: string
 *               is_correct:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Option added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 option_id:
 *                   type: integer
 *       500:
 *         description: Failed to add option
 */
questionRouter.post("/:question_id/options", async (req, res) => {
    try {
        const { question_id } = req.params;
        const { option_text, is_correct } = req.body;
        
        const [result] = await db_con.query(
            "INSERT INTO `question_options`(`question_id`, `option_text`, `is_correct`) VALUES (?,?,?)", 
            [question_id, option_text, is_correct]
        );
        
        return res.status(201).json({ 
            "message": "Option added successfully",
            "option_id": result.insertId
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": "Failed to add option" });
    }
});

/**
 * @swagger
 * /questions/{question_id}/options:
 *   get:
 *     summary: Get all options for a question
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: question_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of question options
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   option_id:
 *                     type: integer
 *                   question_id:
 *                     type: integer
 *                   option_text:
 *                     type: string
 *                   is_correct:
 *                     type: boolean
 *       500:
 *         description: Failed to fetch options
 */
questionRouter.get("/:question_id/options", async (req, res) => {
    try {
        const { question_id } = req.params;
        const [options] = await db_con.query(
            "SELECT * FROM `question_options` WHERE `question_id`=?", 
            [question_id]
        );
        
        return res.status(200).json(options);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": "Failed to fetch options" });
    }
});

/**
 * @swagger
 * /questions/options/{option_id}:
 *   get:
 *     summary: Get a specific option
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: option_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Option details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 option_id:
 *                   type: integer
 *                 question_id:
 *                   type: integer
 *                 option_text:
 *                   type: string
 *                 is_correct:
 *                   type: boolean
 *       404:
 *         description: Option not found
 *       500:
 *         description: Failed to fetch option
 */
questionRouter.get("/options/:option_id", async (req, res) => {
    try {
        const { option_id } = req.params;
        const [option] = await db_con.query(
            "SELECT * FROM `question_options` WHERE `option_id`=?", 
            [option_id]
        );
        
        if (option.length === 0) {
            return res.status(404).json({ "error": "Option not found" });
        }
        
        return res.status(200).json(option[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": "Failed to fetch option" });
    }
});

/**
 * @swagger
 * /questions/options/{option_id}:
 *   put:
 *     summary: Update a question option
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: option_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               option_text:
 *                 type: string
 *               is_correct:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Option updated successfully
 *       500:
 *         description: Update failed
 */
questionRouter.put("/options/:option_id", async (req, res) => {
    try {
        const { option_id } = req.params;
        const { option_text, is_correct } = req.body;
        
        await db_con.query(
            "UPDATE `question_options` SET `option_text`=?, `is_correct`=? WHERE `option_id`=?", 
            [option_text, is_correct, option_id]
        );
        
        return res.status(200).json({ "message": "Option updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": "Update failed" });
    }
});

/**
 * @swagger
 * /questions/options/{option_id}:
 *   delete:
 *     summary: Delete a question option
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: option_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Option deleted successfully
 *       500:
 *         description: Deletion failed
 */
questionRouter.delete("/options/:option_id", async (req, res) => {
    try {
        const { option_id } = req.params;
        await db_con.query("DELETE FROM `question_options` WHERE `option_id`=?", [option_id]);
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": "Deletion failed" });
    }
});

export default questionRouter;