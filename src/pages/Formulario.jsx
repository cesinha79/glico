import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Formulario.css";

const perguntas = [
  { tipo: "simnao", texto: "Você possui pressão alta?" },
  { tipo: "simnao", texto: "Você possui colesterol alto?" },
  { tipo: "imc",    texto: "Insira seu peso e altura" },
  { tipo: "simnao", texto: "Você fuma?" },
  { tipo: "simnao", texto: "Pratica atividade física regularmente?" },
  { tipo: "simnao", texto: "Já teve algum problema cardíaco ou ataque cardíaco?" },
  { tipo: "simnao", texto: "Você já teve um AVC?" },
  { tipo: "escala", texto: "Como você avalia a sua saúde?" },
  { tipo: "numero", texto: "Quantos dias no mês sua saúde mental não foi boa?" },
  { tipo: "numero", texto: "Quantos dias no mês sua saúde física não foi boa?" },
  { tipo: "simnao", texto: "Você consome bebida alcoólica com frequência?" },
  { tipo: "simnao", texto: "Você consome frutas com frequência?" },
  { tipo: "simnao", texto: "Você consome vegetais com frequência?" },
  { tipo: "sexo",   texto: "Qual é o seu sexo?" },
  { tipo: "idade",  texto: "Quantos anos você tem?" },
];

export default function Formulario() {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState(0);
  const [respostas, setRespostas] = useState({});

  const perguntaAtual = perguntas[etapa];
  const progresso = ((etapa + 1) / perguntas.length) * 100;

  const salvarResposta = (valor) => {
    setRespostas({ ...respostas, [etapa]: valor });
  };

  const proxima = () => {
    if (etapa < perguntas.length - 1) {
      setEtapa(etapa + 1);
    } else {
      // Última pergunta: navega para resultados passando respostas
      navigate("/resultados", { state: { respostas } });
    }
  };

  const anterior = () => {
    if (etapa > 0) setEtapa(etapa - 1);
  };

  const respostaAtual = respostas[etapa];

  const renderPergunta = () => {
    switch (perguntaAtual.tipo) {
      case "simnao":
        return (
          <div className="opcoes">
            {["Sim", "Não"].map((op) => (
              <button
                key={op}
                className={respostaAtual === op ? "selecionado" : ""}
                onClick={() => salvarResposta(op)}
              >
                {op}
              </button>
            ))}
          </div>
        );

      case "sexo":
        return (
          <div className="opcoes">
            {["Masculino", "Feminino"].map((op) => (
              <button
                key={op}
                className={respostaAtual === op ? "selecionado" : ""}
                onClick={() => salvarResposta(op)}
              >
                {op}
              </button>
            ))}
          </div>
        );

      case "numero":
      case "idade":
        return (
          <input
            type="number"
            placeholder={perguntaAtual.tipo === "idade" ? "Ex: 35" : "Ex: 5"}
            min={0}
            max={perguntaAtual.tipo === "numero" ? 30 : 120}
            value={respostaAtual ?? ""}
            onChange={(e) => salvarResposta(e.target.value)}
          />
        );

      case "escala":
        return (
          <div className="escala">
            <span>Excelente</span>
            {[1, 2, 3, 4, 5].map((item) => (
              <button
                key={item}
                className={respostaAtual === item ? "selecionado" : ""}
                onClick={() => salvarResposta(item)}
              >
                {item}
              </button>
            ))}
            <span>Ruim</span>
          </div>
        );

      case "imc":
        return (
          <div className="imc-box">
            <input
              type="number"
              placeholder="Peso (kg)"
              min={1}
              value={respostaAtual?.peso ?? ""}
              onChange={(e) =>
                salvarResposta({ ...respostaAtual, peso: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Altura (cm)"
              min={1}
              value={respostaAtual?.altura ?? ""}
              onChange={(e) =>
                salvarResposta({ ...respostaAtual, altura: e.target.value })
              }
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="formulario-page">
      <header className="topo">
        <div className="logo">GLICO</div>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/formulario" className="ativo">Formulário</Link>
          <Link to="/resultados">Resultados</Link>
        </nav>
      </header>

      <div className="barra-container">
        <div className="barra" style={{ width: `${progresso}%` }} />
      </div>

      <p className="contador">
        {etapa + 1} de {perguntas.length}
      </p>

      <div className="pergunta-box">
        <p className="questao">Questão {etapa + 1}</p>
        <h2>{perguntaAtual.texto}</h2>
        {renderPergunta()}
      </div>

      <div className="botoes-nav">
        <button onClick={anterior} disabled={etapa === 0}>
          Anterior
        </button>
        <button onClick={proxima}>
          {etapa === perguntas.length - 1 ? "Ver Resultado" : "Próxima"}
        </button>
      </div>
    </div>
  );
}