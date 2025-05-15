const Quiz = require("../models/Quiz");

exports.createQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;

    const quiz = new Quiz({
      title,
      questions,
      createdBy: req.user.userId,
    });

    await quiz.save();
    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (err) {
    res.status(400).json({ message: "Failed to create quiz", error: err.message });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().select("title _id");
    res.status(200).json({ quizzes });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch quizzes", error: err.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const publicQuestions = quiz.questions.map(q => ({
      type: q.type,
      questionText: q.questionText,
      options: q.options,
      mediaUrl: q.mediaUrl // Include mediaUrl in the response
    }));

    res.status(200).json({ _id: quiz._id, title: quiz.title, questions: publicQuestions });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch quiz", error: err.message });
  }
};
