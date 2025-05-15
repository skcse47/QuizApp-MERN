import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizApi, submissionApi, getFullMediaUrl } from '../../services/api';

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await quizApi.getQuizById(id);
        setQuiz(response.data);
        // Initialize answers array with empty selections
        setAnswers(response.data.questions.map(() => ({ selectedOption: null })));
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch quiz');
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleOptionSelect = (optionIndex) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = {
      questionIndex: currentQuestion,
      selectedOption: optionIndex
    };
    setAnswers(updatedAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unansweredQuestions = answers.filter(answer => answer.selectedOption === null);
    if (unansweredQuestions.length > 0) {
      setError(`Please answer all questions. ${unansweredQuestions.length} questions are unanswered.`);
      return;
    }

    setSubmitting(true);
    try {
      await submissionApi.submitQuiz(id, answers);
      navigate('/examinee/dashboard');
    } catch (err) {
      setError('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => navigate('/examinee/dashboard')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Quiz not found
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">{question.questionText}</h2>
            
            {question.type === 'image' && question.mediaUrl && (
              <div className="mb-4">
                <img 
                  src={getFullMediaUrl(question.mediaUrl)} 
                  alt="Question" 
                  className="max-h-64 object-contain mx-auto"
                />
              </div>
            )}
            
            {question.type === 'audio' && question.mediaUrl && (
              <div className="mb-4">
                <audio controls className="w-full">
                  <source src={getFullMediaUrl(question.mediaUrl)} />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            
            <div className="space-y-3 mt-4">
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center">
                  <input
                    type="radio"
                    id={`option-${optionIndex}`}
                    name={`question-${currentQuestion}`}
                    checked={answers[currentQuestion]?.selectedOption === optionIndex}
                    onChange={() => handleOptionSelect(optionIndex)}
                    className="mr-3"
                  />
                  <label htmlFor={`option-${optionIndex}`} className="text-lg">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className={`px-4 py-2 rounded ${
                currentQuestion === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            
            {currentQuestion < quiz.questions.length - 1 ? (
              <button
                onClick={nextQuestion}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="flex flex-wrap gap-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                  ${
                    answers[index]?.selectedOption !== null
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200'
                  }
                  ${currentQuestion === index ? 'ring-2 ring-indigo-500' : ''}
                `}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;
