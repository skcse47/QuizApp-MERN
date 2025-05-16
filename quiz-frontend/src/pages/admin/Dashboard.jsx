import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizApi } from '../../services/api';

const AdminDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await quizApi.getAllQuizzes();
        setQuizzes(response.data.quizzes);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch quizzes');
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Link
          to="/admin/create-quiz"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          Create New Quiz
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Your Quizzes</h2>
        </div>

        {quizzes.length === 0 ? (
          <div className="px-6 py-4 text-gray-500">
            No quizzes created yet. Click "Create New Quiz" to get started.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {quizzes.map((quiz) => (
              <li key={quiz._id} className="px-6 py-4 flex items-center justify-between">
                <span className="text-lg font-medium">{quiz.title}</span>
                <div className="flex space-x-2 hidden">
                  <Link
                    to={`/admin/quiz/${quiz._id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View Details
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
