import React, { useEffect, useState } from 'react';
import axios from '../api/api';
import { useParams } from 'react-router-dom';

function Livro() {
  const { id } = useParams(); // id do livro na URL
  const [livro, setLivro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchLivro() {
      try {
        const response = await axios.get(`/auth/livros/${id}`);
        setLivro(response.data);
      } catch (err) {
        setError('Livro não encontrado ou erro ao carregar.');
      } finally {
        setLoading(false);
      }
    }
    fetchLivro();
  }, [id]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;
  if (!livro) return null;

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h1 style={{ marginBottom: 8 }}>{livro.titulo}</h1>
      <p style={{ color: '#555', fontSize: 16, marginBottom: 24 }}>Autor: <b>{livro.autor_email}</b></p>
      <div style={{ fontSize: 18, lineHeight: 1.7 }}>{livro.conteudo}</div>
    </div>
  );
}

export default Livro;
