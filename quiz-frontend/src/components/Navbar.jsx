import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Quiz App
        </Link>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="hidden md:inline">
                Welcome, {user?.name} ({user?.role})
              </span>
              
              {isAdmin ? (
                <Link to="/admin/dashboard" className="hover:text-gray-300">
                  Admin Dashboard
                </Link>
              ) : (
                <Link to="/examinee/dashboard" className="hover:text-gray-300">
                  My Quizzes
                </Link>
              )}
              
              <button 
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">
                Login
              </Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
