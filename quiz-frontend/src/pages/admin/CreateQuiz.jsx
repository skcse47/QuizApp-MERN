import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizApi, getFullMediaUrl } from '../../services/api';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { type: 'text', questionText: '', options: ['', '', '', ''], correctAnswer: 0, mediaUrl: '' }
  ]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Check if we have at least one image and one audio question
  const hasImageQuestion = questions.some(q => q.type === 'image');
  const hasAudioQuestion = questions.some(q => q.type === 'audio');

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    const options = [...updatedQuestions[questionIndex].options];
    options[optionIndex] = value;
    updatedQuestions[questionIndex].options = options;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correctAnswer = parseInt(value);
    setQuestions(updatedQuestions);
  };

  const handleFileUpload = async (questionIndex, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const questionType = questions[questionIndex].type;
    if (questionType !== 'image' && questionType !== 'audio') {
      setError('File upload is only supported for image and audio questions');
      return;
    }

    // Check file type
    if (questionType === 'image' && !file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (questionType === 'audio' && !file.type.startsWith('audio/')) {
      setError('Please upload an audio file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', questionType);

      const response = await quizApi.uploadMedia(file, questionType);
      
      // Update the question with the media URL
      const updatedQuestions = [...questions];
      updatedQuestions[questionIndex].mediaUrl = response.data.url;
      setQuestions(updatedQuestions);
      
    } catch (err) {
      setError('Failed to upload file. Please try again.');
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { type: 'text', questionText: '', options: ['', '', '', ''], correctAnswer: 0, mediaUrl: '' }
    ]);
    setCurrentStep(questions.length);
  };

  const removeQuestion = (index) => {
    if (questions.length <= 1) {
      setError('Quiz must have at least one question');
      return;
    }

    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    
    if (currentStep >= updatedQuestions.length) {
      setCurrentStep(updatedQuestions.length - 1);
    }
  };

  const validateQuiz = () => {
    // Check if title is provided
    if (!title.trim()) {
      setError('Please provide a quiz title');
      return false;
    }

    // Check if we have at least 10 questions
    if (questions.length < 10) {
      setError('Quiz must have at least 10 questions');
      return false;
    }

    // Check if we have at least one image and one audio question
    if (!hasImageQuestion) {
      setError('Quiz must include at least one image question');
      return false;
    }

    if (!hasAudioQuestion) {
      setError('Quiz must include at least one audio question');
      return false;
    }

    // Check if all questions have text and options
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      
      if (!q.questionText.trim()) {
        setError(`Question ${i + 1} is missing text`);
        setCurrentStep(i);
        return false;
      }

      // For image and audio questions, check if media URL is provided
      if ((q.type === 'image' || q.type === 'audio') && !q.mediaUrl) {
        setError(`Question ${i + 1} is missing ${q.type} file`);
        setCurrentStep(i);
        return false;
      }

      // Check if all options are provided
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          setError(`Question ${i + 1}, Option ${j + 1} is missing`);
          setCurrentStep(i);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateQuiz()) {
      return;
    }

    setLoading(true);

    try {
      await quizApi.createQuiz({ title, questions });
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevQuestion = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Quiz</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Quiz Title
            </label>
            <input
              id="title"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter quiz title"
              required
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">
                Question {currentStep + 1} of {questions.length}
              </h2>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={prevQuestion}
                  disabled={currentStep === 0}
                  className={`px-3 py-1 rounded ${
                    currentStep === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={nextQuestion}
                  disabled={currentStep === questions.length - 1}
                  className={`px-3 py-1 rounded ${
                    currentStep === questions.length - 1
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>

            <div className="p-4 border rounded">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Question Type
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={questions[currentStep].type}
                  onChange={(e) => handleQuestionChange(currentStep, 'type', e.target.value)}
                >
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                  <option value="audio">Audio</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Question Text
                </label>
                <input
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={questions[currentStep].questionText}
                  onChange={(e) => handleQuestionChange(currentStep, 'questionText', e.target.value)}
                  placeholder="Enter question text"
                  required
                />
              </div>

              {(questions[currentStep].type === 'image' || questions[currentStep].type === 'audio') && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Upload {questions[currentStep].type === 'image' ? 'Image' : 'Audio'}
                  </label>
                  <input
                    type="file"
                    accept={questions[currentStep].type === 'image' ? 'image/*' : 'audio/*'}
                    onChange={(e) => handleFileUpload(currentStep, e)}
                    className="w-full"
                  />
                  {questions[currentStep].mediaUrl && (
                    <div className="mt-2">
                      {questions[currentStep].type === 'image' ? (
                        <img
                          src={getFullMediaUrl(questions[currentStep].mediaUrl)}
                          alt="Question"
                          className="h-32 object-contain"
                        />
                      ) : (
                        <audio controls>
                          <source src={getFullMediaUrl(questions[currentStep].mediaUrl)} />
                          Your browser does not support the audio element.
                        </audio>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Options
                </label>
                {questions[currentStep].options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center mb-2">
                    <input
                      type="radio"
                      id={`option-${optionIndex}`}
                      name={`correct-answer-${currentStep}`}
                      value={optionIndex}
                      checked={questions[currentStep].correctAnswer === optionIndex}
                      onChange={(e) => handleCorrectAnswerChange(currentStep, e.target.value)}
                      className="mr-2"
                    />
                    <input
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={option}
                      onChange={(e) => handleOptionChange(currentStep, optionIndex, e.target.value)}
                      placeholder={`Option ${optionIndex + 1}`}
                      required
                    />
                  </div>
                ))}
                <p className="text-sm text-gray-600 mt-1">
                  Select the radio button next to the correct answer
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeQuestion(currentStep)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Remove Question
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <button
                type="button"
                onClick={addQuestion}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Add Question
              </button>
            </div>
            <div className="text-sm text-gray-600">
              {questions.length} questions total
              {questions.length < 10 && (
                <span className="text-red-500"> (minimum 10 required)</span>
              )}
              <br />
              {!hasImageQuestion && (
                <span className="text-red-500">At least one image question required</span>
              )}
              {!hasAudioQuestion && (
                <span className="block text-red-500">At least one audio question required</span>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            {loading ? 'Creating Quiz...' : 'Create Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
