import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

function Inicio() {
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLivros() {
      try {
        const response = await api.get('/auth/livros');
        setLivros(response.data);
      } catch (err) {
        setError('Erro ao carregar livros.');
      } finally {
        setLoading(false);
      }
    }
    fetchLivros();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  return (
    <>
      <div>
        <h1>Bem-vindo à Biblioteca Online</h1>
        <p>Explore nossa coleção de livros.</p>
      </div>
      <div>
        <h2>Livros Disponíveis</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
          {livros.length === 0 && <p>Nenhum livro cadastrado.</p>}
          {livros.map(livro => (
            <div
              key={livro.id}
              style={{
                background: '#fff',
                borderRadius: 8,
                boxShadow: '0 2px 8px #eee',
                padding: 20,
                minWidth: 220,
                cursor: 'pointer',
                transition: 'box-shadow 0.2s',
                border: '1px solid #eee',
                textAlign: 'left'
              }}
              onClick={() => navigate(`/livro/${livro.id}`)}
            >
              <h3 style={{ margin: '0 0 8px 0', fontSize: 20 }}>{livro.titulo}</h3>
              <p style={{ color: '#555', fontSize: 15, margin: 0 }}>Autor: <b>{livro.autor_email}</b></p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Inicio;