import React, { useState } from 'react';
import api from '../api/api'; // Sua instância configurada do Axios
import { useNavigate } from 'react-router-dom';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Envia os dados para a rota de registro do backend
            await api.post('/auth/register', { email, password });
            
            // 2. Notifica o usuário e redireciona para o login
            alert('Usuário registrado com sucesso! Faça o login.');
            navigate('/login');
            
        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
            // 3. Trata erros, como 'Email já cadastrado'
            const message = error.response?.data?.message || 'Erro ao registrar. Tente novamente.';
            alert(message);
        }
    };

    return (
        <div className="painel-inventario" style={{ maxWidth: '400px', marginTop: '100px' }}>
            <h2 style={{ color: '#fff', textShadow: '2px 2px #000', textAlign: 'center' }}>Registro de Usuário</h2>
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
                <button type="submit" className="botao-bedrock" style={{ width: '100%' }}>Registrar</button>
            </form>
        </div>
    );
}

export default Register;
