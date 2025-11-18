import React, { useState } from 'react';
import axios from '../api/api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Preencha o email e a senha.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
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
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
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