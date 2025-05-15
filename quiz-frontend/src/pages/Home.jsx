import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (isAdmin) {
      navigate('/admin/dashboard');
    } else {
      navigate('/examinee/dashboard');
    }
  };

  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Online Quiz Application
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Create and take quizzes with multiple choice questions including text, images, and audio.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={handleGetStarted}
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isAuthenticated
                  ? isAdmin
                    ? 'Go to Admin Dashboard'
                    : 'Take a Quiz'
                  : 'Get Started'}
              </button>
            </div>
            
            {isAuthenticated && (
              <p className="mt-6 text-sm text-gray-500">
                Logged in as {user.name} ({user.role})
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
