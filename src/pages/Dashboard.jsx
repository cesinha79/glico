import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const nome = localStorage.getItem('nome') || 'Usuário';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nome');
    navigate('/login');
  };

  // Dados de histórico fictícios — serão substituídos pela API do colega
  const historyItems = [
    { id: 1, date: '12 de Abril, 2026',    result: '67% Risco Médio', status: 'medium' },
    { id: 2, date: '05 de Março, 2026',    result: '12% Risco Baixo', status: 'low'    },
    { id: 3, date: '20 de Fevereiro, 2026',result: '89% Risco Alto',  status: 'high'   },
  ];

  return (
    <div className="dashboard-page-wrapper">
      <header className="dashboard-header">
        <div className="dashboard-logo">GLICO</div>
        <nav className="dashboard-nav">
          <Link to="/"           className={`nav-link ${location.pathname === '/'           ? 'active' : ''}`}>Home</Link>
          <Link to="/formulario" className={`nav-link ${location.pathname === '/formulario' ? 'active' : ''}`}>Formulário</Link>
          <Link to="/resultados" className={`nav-link ${location.pathname === '/resultados' ? 'active' : ''}`}>Resultados</Link>
          <Link to="/dashboard"  className={`nav-link ${location.pathname === '/dashboard'  ? 'active' : ''}`}>Dashboard</Link>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>Sair</button>
      </header>

      <main className="dashboard-main">
        <section className="welcome-section">
          <h1>Olá, {nome} 👋</h1>
          <p>Aqui está um resumo da sua saúde e previsões recentes.</p>
        </section>

        {/* Health Cards */}
        <section className="health-cards-grid">
          <div className="glass-card health-card">
            <span className="card-title">Última Previsão</span>
            <span className="card-value">67%</span>
            <span className="card-status status-medium">Risco Médio</span>
          </div>

          <div className="glass-card health-card">
            <span className="card-title">Nível de Risco</span>
            <span className="card-value">Estável</span>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)' }}>Baseado nas suas últimas 3 consultas.</p>
          </div>

          <div className="glass-card health-card">
            <span className="card-title">Próximo Passo</span>
            <p style={{ margin: 0, fontSize: '16px', lineHeight: '1.5' }}>
              Responda o formulário para atualizar sua avaliação de risco.
            </p>
            <Link to="/formulario" className="card-action-btn">Iniciar Avaliação →</Link>
          </div>
        </section>

        {/* Recent History */}
        <section className="history-section">
          <h2>Histórico Recente</h2>
          <div className="history-list">
            {historyItems.map((item) => (
              <div key={item.id} className="glass-card history-item">
                <div className="history-info">
                  <span className="history-date">{item.date}</span>
                  <span className={`history-result status-${item.status}`}>{item.result}</span>
                </div>
                <button className="history-btn">Ver Detalhes</button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
