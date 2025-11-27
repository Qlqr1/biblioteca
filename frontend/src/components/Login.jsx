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
    <div className="painel-inventario" style={{ maxWidth: '400px', marginTop: '100px' }}>
      <h2 style={{ color: '#fff', textShadow: '2px 2px #000', textAlign: 'center' }}>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="input-obsidian"
        />
        <br /><br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
          className="input-obsidian"
        />
        <br /><br />
        <button type="submit" className="botao-bedrock" style={{ width: '100%' }}>Entrar</button>
      </form>
    </div>
  );
}

export default Login;
