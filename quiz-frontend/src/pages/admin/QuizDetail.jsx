import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { quizApi, getFullMediaUrl } from '../../services/api';

const QuizDetail = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await quizApi.getQuizById(id);
        setQuiz(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch quiz details');
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{quiz.title}</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Quiz Details</h2>
        </div>

        <div className="px-6 py-4">
          <p className="mb-2">
            <span className="font-semibold">Total Questions:</span> {quiz.questions.length}
          </p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Questions</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {quiz.questions.map((question, index) => (
            <div key={index} className="px-6 py-4">
              <div className="flex items-start mb-2">
                <span className="font-semibold mr-2">Q{index + 1}:</span>
                <div>
                  <p className="font-medium">{question.questionText}</p>
                  
                  {question.type === 'image' && question.mediaUrl && (
                    <div className="mt-2 mb-3">
                      <img 
                        src={getFullMediaUrl(question.mediaUrl)} 
                        alt={`Question ${index + 1}`} 
                        className="h-40 object-contain"
                      />
                    </div>
                  )}
                  
                  {question.type === 'audio' && question.mediaUrl && (
                    <div className="mt-2 mb-3">
                      <audio controls className="w-full">
                        <source src={getFullMediaUrl(question.mediaUrl)} />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                  
                  <div className="mt-2 ml-4">
                    <p className="text-sm text-gray-600 mb-1">Options:</p>
                    <ol className="list-decimal list-inside">
                      {question.options.map((option, optionIndex) => (
                        <li key={optionIndex} className="mb-1">
                          {option}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizDetail;
