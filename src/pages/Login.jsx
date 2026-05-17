import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const endpoint = isLogin ? '/login' : '/register';
    const body = isLogin ? { email, senha } : { nome, email, senha };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.erro || 'Erro no servidor.');
        return;
      }

      if (isLogin) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setMessage('Registro concluído. Faça login para continuar.');
        setIsLogin(true);
        setSenha('');
      }
    } catch (error) {
      setMessage('Falha de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-logo">GLICO</h1>

      <div className="login-card">
        <div className="toggle-container">
          <button
            className={`toggle-btn ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(true);
              setMessage('');
            }}
          >
            Entrar
          </button>
          <button
            className={`toggle-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false);
              setMessage('');
            }}
          >
            Registrar
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {isLogin ? (
            <>
              <h2 className="welcome-text">Bem-vindo de volta!</h2>

              <div className="input-group">
                <label className="input-label">E-mail</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="Insira seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <div className="label-container">
                  <label className="input-label">Senha</label>
                  <a href="#" className="forgot-password">Esqueceu a sua senha?</a>
                </div>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Insira sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>

              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? 'Acessando...' : 'Entrar'}
              </button>
            </>
          ) : (
            <>
              <h2 className="welcome-text">Crie sua conta</h2>

              <div className="input-group">
                <label className="input-label">Nome</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Insira seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">E-mail</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="Insira seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <div className="label-container">
                  <label className="input-label">Senha</label>
                </div>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Mínimo de 6 dígitos"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? 'Registrando...' : 'Registrar'}
              </button>
            </>
          )}
        </form>

        {message && <p className="message-text">{message}</p>}
      </div>

      <div className="footer-text">2026 © Grupo 2</div>
    </div>
  );
};

export default Login;
