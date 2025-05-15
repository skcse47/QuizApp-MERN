const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
} = require("../controllers/quizController");
const { uploadMedia } = require("../controllers/uploadController");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

router.post("/", authMiddleware, authorizeRoles("Admin"), createQuiz);
router.get("/", authMiddleware, getAllQuizzes);
router.get("/:id", authMiddleware, getQuizById);
router.post("/upload", authMiddleware, upload.single("file"), uploadMedia);

module.exports = router;
