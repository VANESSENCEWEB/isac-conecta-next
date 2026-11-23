import './Alerta.css'

// Escolhe o ícone conforme o tipo do aviso.
// Recebe informacao, atencao ou erro.
// Devolve o desenho, sem texto para o leitor de tela (o título já diz o que é).
function IconeAlerta({ tipo }) {
  if (tipo === 'atencao') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 4.5 3.5 19h17L12 4.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M12 10v4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="17" r="0.8" fill="currentColor" />
      </svg>
    )
  }

  if (tipo === 'erro') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="8" r="0.8" fill="currentColor" />
    </svg>
  )
}

// Aviso curto: informação, atenção (pede uma ação) ou erro.
// Recebe o tipo, o título e o texto (children).
// Devolve a caixa colorida com ícone, título e texto.
export default function Alerta({ tipo = 'informacao', titulo, children }) {
  const papel = tipo === 'informacao' ? 'status' : 'alert'

  return (
    <div className={`alerta alerta--${tipo}`} role={papel}>
      <span className="alerta__icone">
        <IconeAlerta tipo={tipo} />
      </span>
      <div className="alerta__texto">
        <p className="alerta__titulo">{titulo}</p>
        <p className="alerta__corpo">{children}</p>
      </div>
    </div>
  )
}
