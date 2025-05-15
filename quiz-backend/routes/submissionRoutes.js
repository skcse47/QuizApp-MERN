const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const {
  submitQuiz,
  getUserSubmissions,
} = require("../controllers/submissionController");

router.post("/:quizId/submit", authMiddleware, authorizeRoles("Examinee"), submitQuiz);
router.get("/my", authMiddleware, authorizeRoles("Examinee"), getUserSubmissions);

module.exports = router;
