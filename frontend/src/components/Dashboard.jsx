import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/texto', { titulo, conteudo });
      alert('Livro postado com sucesso!');
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao postar. Tente novamente.';
      alert(message);
    }
  };

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const response = await api.get('http://localhost:5000/api/protected');
        setMessage(response.data.message);
      } catch (error) {
        console.error('Erro ao acessar rota protegida:', error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchProtectedData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <div className="painel-inventario">
        <h2 className="titulo-secao">Perfil</h2>
        <p>{message}</p>
        <button className="botao-bedrock" onClick={handleLogout}>Sair</button>
      </div>

      <div className="painel-inventario">
        <h3 className="titulo-secao">Postar Livro</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="input-obsidian"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título do Livro"
            required
          />

          <br /><br />

          <textarea
            className="input-obsidian"
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            placeholder="Conteúdo do livro"
            rows={5}
            required
          />

          <br /><br />

          <button className="botao-bedrock" type="submit">Adicionar Livro</button>
        </form>
      </div>
    </>
  );
}

export default Dashboard;
