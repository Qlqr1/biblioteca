import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register.jsx';
import Dashboard from './components/Dashboard';
import Inicio from './components/Inicio.jsx';
import Livro from './components/Livro.jsx';

// Guarda de rota
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>

      {/* NAV — agora sem header */}
      <nav className="nav-mc">
        <Link to="/" className="nav-btn">Home</Link>
        <Link to="/login" className="nav-btn">Login</Link>
        <Link to="/register" className="nav-btn">Registro</Link>
        <Link to="/dashboard" className="nav-btn">Perfil</Link>
      </nav>

      {/* ROTAS */}
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/livro/:id" element={<Livro />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
