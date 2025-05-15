const Submission = require("../models/Submission");
const Quiz = require("../models/Quiz");

exports.submitQuiz = async (req, res) => {
  const { quizId } = req.params;
  const { answers } = req.body;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let score = 0;
    const detailedAnswers = answers.map(({ questionIndex, selectedOption }) => {
      const correctAnswer = quiz.questions[questionIndex].correctAnswer;
      const isCorrect = correctAnswer === selectedOption;
      if (isCorrect) score++;
      return { questionIndex, selectedOption, isCorrect };
    });

    const submission = new Submission({
      quiz: quizId,
      user: req.user.userId,
      answers: detailedAnswers,
      score,
    });

    await submission.save();
    res.status(201).json({ message: "Quiz submitted", score });
  } catch (err) {
    res.status(400).json({ message: "Submission failed", error: err.message });
  }
};

exports.getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user.userId })
      .populate("quiz", "title")
      .select("-__v");

    res.status(200).json({ submissions });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch submissions", error: err.message });
  }
};
