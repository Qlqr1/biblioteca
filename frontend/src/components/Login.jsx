import React, { useState } from 'react';
import axios from '../api/api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [identifier, setIdentifier] = useState(''); // email ou nome
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      alert('Preencha o campo de usuário/email e a senha.');
      return;
    }
    try {
      // Envia o valor como email e nome para o backend
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: identifier,
        nome: identifier,
        password
      });
      localStorage.setItem('token', response.data.token);
      alert('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro de login:', error);
      alert('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Email ou nome de usuário"
          required
        />
        <br /><br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
        />
        <br /><br />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;