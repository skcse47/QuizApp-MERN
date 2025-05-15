import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

// Context
import { AuthProvider } from './context/AuthContext'

// Components
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Unauthorized from './pages/Unauthorized'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import CreateQuiz from './pages/admin/CreateQuiz'
import QuizDetail from './pages/admin/QuizDetail'

// Examinee Pages
import ExamineeDashboard from './pages/examinee/Dashboard'
import TakeQuiz from './pages/examinee/TakeQuiz'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="pb-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<Home />} />
              
              {/* Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/create-quiz" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <CreateQuiz />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/quiz/:id" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <QuizDetail />
                  </ProtectedRoute>
                } 
              />
              
              {/* Examinee Routes */}
              <Route 
                path="/examinee/dashboard" 
                element={
                  <ProtectedRoute>
                    <ExamineeDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/examinee/quiz/:id" 
                element={
                  <ProtectedRoute>
                    <TakeQuiz />
                  </ProtectedRoute>
                } 
              />
              
              {/* Fallback Routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <ToastContainer position="bottom-right" />
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
