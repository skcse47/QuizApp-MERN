const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["text", "image", "audio"],
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctAnswer: {
    type: Number,
    required: true,
  },
  mediaUrl: { type: String }   

});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  questions: {
    type: [questionSchema],
    required: true,
    validate: {
      validator: function (value) {
        const hasImage = value.some(q => q.type === "image");
        const hasAudio = value.some(q => q.type === "audio");
        return hasImage && hasAudio && value.length >= 10;
      },
      message: "Quiz must have at least 10 questions including one image and one audio question",
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Quiz", quizSchema);
