import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizApi, submissionApi } from '../../services/api';

const ExamineeDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizzesResponse, submissionsResponse] = await Promise.all([
          quizApi.getAllQuizzes(),
          submissionApi.getUserSubmissions()
        ]);
        
        setQuizzes(quizzesResponse.data.quizzes);
        setSubmissions(submissionsResponse.data.submissions);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to check if a quiz has been attempted
  const hasAttemptedQuiz = (quizId) => {
    return submissions.some(submission => submission.quiz._id === quizId);
  };

  // Helper function to get score for a quiz
  const getQuizScore = (quizId) => {
    const submission = submissions.find(sub => sub.quiz._id === quizId);
    return submission ? submission.score : null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Examinee Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Available Quizzes</h2>
          </div>

          {quizzes.length === 0 ? (
            <div className="px-6 py-4 text-gray-500">
              No quizzes available at the moment.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {quizzes.map((quiz) => (
                <li key={quiz._id} className="px-6 py-4 flex items-center justify-between">
                  <span className="text-lg font-medium">{quiz.title}</span>
                  <div>
                    {hasAttemptedQuiz(quiz._id) ? (
                      <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        Completed - Score: {getQuizScore(quiz._id)}
                      </span>
                    ) : (
                      <Link
                        to={`/examinee/quiz/${quiz._id}`}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Take Quiz
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Your Submissions</h2>
          </div>

          {submissions.length === 0 ? (
            <div className="px-6 py-4 text-gray-500">
              You haven't submitted any quizzes yet.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {submissions.map((submission) => (
                <li key={submission._id} className="px-6 py-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">{submission.quiz.title}</span>
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      Score: {submission.score}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Submitted: {new Date(submission.submittedAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamineeDashboard;
