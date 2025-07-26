import express from 'express';
import { db_con } from '../connection/connection.js';

const submissionRouter = express.Router();

// Start a new quiz submission
/**
 * @swagger
 * tags:
 *   name: Submissions
 *   description: Quiz submissions
 */

/**
 * @swagger
 * /submissions:
 *   post:
 *     summary: Start a new quiz submission
 *     tags: [Submissions]
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
 *               - user_id
 *             properties:
 *               quiz_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Quiz submission started
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 submission_id:
 *                   type: integer
 *       400:
 *         description: Already has an in-progress submission
 *       500:
 *         description: Failed to start submission
 */
submissionRouter.post("/", async (req, res) => {
    try {
        const { quiz_id, user_id } = req.body;
        
        // Check if user already has an in-progress submission
        const [existing] = await db_con.query(
            "SELECT * FROM `quiz_submissions` WHERE `quiz_id`=? AND `user_id`=? AND `status`='in_progress'", 
            [quiz_id, user_id]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ 
                "error": "You already have an in-progress submission for this quiz",
                "submission_id": existing[0].submission_id
            });
        }
        
        const [result] = await db_con.query(
            "INSERT INTO `quiz_submissions`(`quiz_id`, `user_id`) VALUES (?,?)", 
            [quiz_id, user_id]
        );
        
        // Add to processing queue
        await db_con.query(
            "INSERT INTO `submission_queue`(`submission_id`) VALUES (?)", 
            [result.insertId]
        );
        
        return res.status(201).json({ 
            "message": "Quiz submission started",
            "submission_id": result.insertId
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": "Failed to start submission" });
    }
});

// Submit answers
submissionRouter.post("/:submission_id/answers", async (req, res) => {
    try {
        const { submission_id } = req.params;
        const { question_id, answer_text, selected_option_id } = req.body;
        
        await db_con.query(
            "INSERT INTO `submission_answers`(`submission_id`, `question_id`, `answer_text`, `selected_option_id`) VALUES (?,?,?,?)", 
            [submission_id, question_id, answer_text, selected_option_id]
        );
        
        return res.status(201).json({ "message": "Answer submitted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": "Failed to submit answer" });
    }
});

// Update the complete submission endpoint to calculate and store scores
submissionRouter.put("/:submission_id/complete", async (req, res) => {
    try {
        const { submission_id } = req.params;
        
        // 1. Get all answers for this submission
        const [answers] = await db_con.query(
            `SELECT sa.*, q.points, q.question_type, qo.is_correct 
             FROM submission_answers sa
             JOIN questions q ON sa.question_id = q.question_id
             LEFT JOIN question_options qo ON sa.selected_option_id = qo.option_id
             WHERE sa.submission_id = ?`,
            [submission_id]
        );

        // 2. Calculate total score
        let totalScore = 0;
        let totalPossible = 0;
        const scoredAnswers = [];

        answers.forEach(answer => {
            totalPossible += answer.points;
            let pointsEarned = 0;

            // Calculate points based on question type
            if (answer.question_type === 'multiple_choice') {
                if (answer.is_correct) {
                    pointsEarned = answer.points;
                }
            } else if (answer.question_type === 'true_false') {
                // For true/false, we'll need to compare the answer_text with correct answer
                // This requires storing correct answers in questions table
                // For now, we'll assume partial credit
                if (answer.answer_text) {
                    pointsEarned = answer.points * 0.5; // 50% for attempting
                }
            } else {
                // For short_answer/essay, we can't auto-grade, so give partial credit
                if (answer.answer_text) {
                    pointsEarned = answer.points * 0.5; // 50% for attempting
                }
            }

            totalScore += pointsEarned;
            scoredAnswers.push({
                answer_id: answer.answer_id,
                points_earned: pointsEarned
            });
        });

        // 3. Update submission with calculated score
        await db_con.query(
            `UPDATE quiz_submissions 
             SET status='submitted', 
                 submitted_at=NOW(),
                 score=?,
                 total_points=?
             WHERE submission_id=?`,
            [totalScore, totalPossible, submission_id]
        );

        // 4. Update each answer with points earned (optional)
        for (const answer of scoredAnswers) {
            await db_con.query(
                `UPDATE submission_answers 
                 SET points_earned=?
                 WHERE answer_id=?`,
                [answer.points_earned, answer.answer_id]
            );
        }

        return res.status(200).json({ 
            message: "Quiz submitted successfully",
            score: totalScore,
            total_points: totalPossible
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to complete submission" });
    }
});

// Update the get submission endpoint to include more details
submissionRouter.get("/:submission_id", async (req, res) => {
    try {
        const { submission_id } = req.params;
        
        // Get submission details
        const [submission] = await db_con.query(
            `SELECT qs.*, q.title AS quiz_title 
             FROM quiz_submissions qs
             JOIN quizzes q ON qs.quiz_id = q.quiz_id
             WHERE qs.submission_id=?`, 
            [submission_id]
        );
        
        if (submission.length === 0) {
            return res.status(404).json({ error: "Submission not found" });
        }
        
        // Get answers with question details
        const [answers] = await db_con.query(
            `SELECT sa.*, 
                    q.question_text, 
                    q.question_type, 
                    q.points AS question_points,
                    qo.option_text AS selected_option_text,
                    correct_qo.option_text AS correct_option_text
             FROM submission_answers sa
             JOIN questions q ON sa.question_id = q.question_id
             LEFT JOIN question_options qo ON sa.selected_option_id = qo.option_id
             LEFT JOIN question_options correct_qo ON correct_qo.question_id = q.question_id AND correct_qo.is_correct = 1
             WHERE sa.submission_id=?
             ORDER BY q.display_order`,
            [submission_id]
        );
        
        return res.status(200).json({
            submission: submission[0],
            answers
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch submission" });
    }
});
// Admin route: Get all submissions for all students (with filters)
/**
 * @swagger
 * /admin/submissions:
 *   get:
 *     summary: Get all quiz submissions (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: quiz_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [in_progress, submitted]
 *     responses:
 *       200:
 *         description: List of all submissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/QuizSubmissionWithUser'
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Failed to fetch submissions
 */
submissionRouter.get("/admin/submissions", async (req, res) => {
  // Check if user is admin (from JWT or session)
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ error: "Admin access required" });
  }

  try {
    const { quiz_id, user_id, status } = req.query;
    let query = `
      SELECT 
        qs.*,
        q.title AS quiz_title,
        u.username,
        u.first_name,
        u.last_name,
        u.email
      FROM quiz_submissions qs
      JOIN quizzes q ON qs.quiz_id = q.quiz_id
      JOIN users u ON qs.user_id = u.user_id
      WHERE 1=1
    `;
    const params = [];

    // Apply filters
    if (quiz_id) {
      query += " AND qs.quiz_id = ?";
      params.push(quiz_id);
    }
    if (user_id) {
      query += " AND qs.user_id = ?";
      params.push(user_id);
    }
    if (status) {
      query += " AND qs.status = ?";
      params.push(status);
    }

    query += " ORDER BY qs.submitted_at DESC";

    const [submissions] = await db_con.query(query, params);
    res.status(200).json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

// Admin route: Get statistics for quizzes (avg score, pass rate, etc.)
/**
 * @swagger
 * /admin/statistics:
 *   get:
 *     summary: Get quiz performance statistics (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Quiz statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalQuizzes:
 *                   type: integer
 *                 totalSubmissions:
 *                   type: integer
 *                 averageScore:
 *                   type: number
 *                 passRate:
 *                   type: number
 *                 quizzes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/QuizStats'
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Failed to fetch statistics
 */
submissionRouter.get("/admin/statistics", async (req, res) => {
  if (!req.user?.is_admin) {
    return res.status(403).json({ error: "Admin access required" });
  }

  try {
    // Get overall stats
    const [stats] = await db_con.query(`
      SELECT 
        COUNT(DISTINCT q.quiz_id) AS totalQuizzes,
        COUNT(qs.submission_id) AS totalSubmissions,
        AVG(qs.score / q.total_points * 100) AS averageScore,
        SUM(CASE WHEN (qs.score / q.total_points) >= 0.7 THEN 1 ELSE 0 END) / COUNT(*) * 100 AS passRate
      FROM quizzes q
      LEFT JOIN quiz_submissions qs ON q.quiz_id = qs.quiz_id
      WHERE qs.status = 'submitted'
    `);

    // Get quiz-wise stats
    const [quizzes] = await db_con.query(`
      SELECT 
        q.quiz_id,
        q.title,
        COUNT(qs.submission_id) AS attempts,
        AVG(qs.score) AS avgScore,
        MAX(qs.score) AS highScore,
        MIN(qs.score) AS lowScore
      FROM quizzes q
      LEFT JOIN quiz_submissions qs ON q.quiz_id = qs.quiz_id
      WHERE qs.status = 'submitted'
      GROUP BY q.quiz_id
    `);

    res.status(200).json({
      ...stats[0],
      quizzes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});
// Get submissions by quiz_id and/or user_id
submissionRouter.get("/", async (req, res) => {
  try {
    const { quiz_id, user_id } = req.query;

    let query = `
      SELECT * FROM quiz_submissions
      WHERE 1=1
    `;
    const params = [];

    if (quiz_id) {
      query += " AND quiz_id = ?";
      params.push(quiz_id);
    }

    if (user_id) {
      query += " AND user_id = ?";
      params.push(user_id);
    }

    const [submissions] = await db_con.query(query, params);
    res.status(200).json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});


export default submissionRouter;