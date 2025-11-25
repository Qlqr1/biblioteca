import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register.jsx'; // <--- NOVIDADE 1: Importar o componente
import Dashboard from './components/Dashboard';
import Inicio from './components/Inicio.jsx';
import Livro from './components/Livro.jsx';

// Componente que atua como um 'guarda de rota'
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  // Se não houver token, redireciona o usuário para a página de login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  // Se houver token, permite que o componente filho (Dashboard) seja renderizado
  return children;
};

function App() {
  return (
    <Router>
      <header>
        <nav>
          <Link to="/">Home</Link> |
          <Link to="/login">Login</Link> |
          <Link to="/register">Registro</Link> |
          <Link to="/dashboard">Perfil</Link>
        </nav>
      </header>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/livro/:id" element={<Livro />} />
        {/* Rota Protegida */}
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