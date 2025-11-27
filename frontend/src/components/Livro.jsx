import React, { useEffect, useState } from 'react';
import axios from '../api/api';
import { useParams } from 'react-router-dom';

function Livro() {
  const { id } = useParams();
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

  if (loading) return <div className="painel-inventario">Carregando...</div>;
  if (error) return <div className="painel-inventario erro-msg">{error}</div>;
  if (!livro) return null;

  return (
    <div className="painel-inventario">
      <p className="conteudo-livro"><b className="titulo-livro">{livro.titulo}</b></p>
      <p className="conteudo-livro autor-livro">Autor: <b>{livro.autor_email}</b></p>
      <div className="conteudo-livro">{livro.conteudo}</div>
    </div>
  );
}

export default Livro;
