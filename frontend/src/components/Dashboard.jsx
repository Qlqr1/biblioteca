import React, { useEffect, useState } from 'react';
import axios from '../api/api';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Envia os dados para a rota de registro do backend
      await api.post('/auth/texto', { titulo, texto });
      // 2. Notifica o usuário e redireciona para o login
      alert('Livro postado com sucesso!');
        
    } catch (error) {
      // 3. Trata erros, como 'Email já cadastrado'
      const message = error.response?.data?.message || 'Erro ao postar. Tente novamente.';
      alert(message);
    }
  };

  useEffect(() => {
    // Esta função tenta acessar a rota protegida do backend
    const fetchProtectedData = async () => {
      try {
        // A requisição usa o interceptor do Axios para enviar o token automaticamente
        const response = await axios.get('http://localhost:5000/api/protected');
        setMessage(response.data.message);
      } catch (error) {
        // Se houver um erro, o token pode estar inválido. Redireciona para o login.
        console.error('Erro ao acessar rota protegida:', error);
        localStorage.removeItem('token'); // Remove o token inválido
        navigate('/login');
      }
    };

    fetchProtectedData();
  }, [navigate]); // O array vazio garante que o efeito só rode uma vez

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <div style={{ padding: '20px' }}>
          <h2>Perfil</h2>
          <p>{message}</p>
          <button onClick={handleLogout}>Sair</button>
      </div>
      <div>
          <h3>Postar livro</h3>
          <form onSubmit={handleSubmit}>
            <input 
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título do Livro" 
              required 
            />
            <br /><br />
            <input 
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Texto do livro" 
              required 
            />
            <br /><br />
            <button type="submit">Adicionar Livro</button>
          </form>
      </div>
    </>
  );
}

export default Dashboard;