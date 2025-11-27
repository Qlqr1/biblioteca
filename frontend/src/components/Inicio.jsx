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

  if (error) {
    return (
      <div className="erro-container">
        <p className="erro-msg">{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* TÍTULO CENTRALIZADO NO TOPO — ESTILO END CRYSTAL PURPUR */}
      <div className="header-container">
        <h1 className="titulo-ender">EnderBooks</h1>
        <p className="subtitulo">Explore nossa coleção de livros.</p>
      </div>

      <div>
        <h2 className="titulo-secao">Livros Disponíveis</h2>

        <div
          className={`livros-container ${livros.length === 0 ? "vazio" : ""}`}
        >
          {livros.length === 0 && (
            <p className="nenhum-livro">Nenhum livro cadastrado.</p>
          )}

          {livros.map((livro) => (
            <div
              key={livro.id}
              className="livro-card"
              onClick={() => navigate(`/livro/${livro.id}`)}
            >
              <h3>{livro.titulo}</h3>
              <p>
                Autor: <b>{livro.autor_email}</b>
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Inicio;
