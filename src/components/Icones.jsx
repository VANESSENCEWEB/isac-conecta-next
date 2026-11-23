// Ícones simples das telas. A cor vem do CSS (currentColor).
// Cada função não recebe argumentos e devolve o desenho, escondido do leitor de tela.

export function IconeBusca() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="9" cy="9" r="5.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M13.2 13.2 17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconeFiltro() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M3 5h12M5 9h8M7 13h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconeMais() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 4v12M4 10h12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconeMenu() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 6h12M4 10h12M4 14h12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconeCasa() {
  return (
    <svg viewBox="0 0 22 22" aria-hidden="true">
      <path
        d="M4 10.5 11 4l7 6.5V18a1 1 0 0 1-1 1h-4.2v-4.6H9.2V19H5a1 1 0 0 1-1-1v-7.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconeEntrar() {
  // Seta entrando pela porta (a porta fica à direita). Antes a seta saía da porta e parecia "Sair".
  return (
    <svg viewBox="0 0 22 22" aria-hidden="true">
      <path
        d="M12 5h3.5A1.5 1.5 0 0 1 17 6.5v9a1.5 1.5 0 0 1-1.5 1.5H12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M4 11h9M10 8l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Pessoa dentro de um círculo: "minha conta". É o ícone do Entrar na barra de baixo do visitante.
export function IconeConta() {
  return (
    <svg viewBox="0 0 22 22" aria-hidden="true">
      <circle cx="11" cy="11" r="8.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="11" cy="9" r="2.7" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6.3 16.6c1-1.9 2.7-2.9 4.7-2.9s3.7 1 4.7 2.9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconeCoracao({ preenchido = false }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M10 16.2 4.4 10.8a3.2 3.2 0 0 1 4.5-4.5L10 7.4l1.1-1.1a3.2 3.2 0 0 1 4.5 4.5L10 16.2Z"
        fill={preenchido ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconePino() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 14s4.2-3.6 4.2-6.4A4.2 4.2 0 0 0 8 3.4a4.2 4.2 0 0 0-4.2 4.2C3.8 10.4 8 14 8 14Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="8" cy="7.6" r="1.3" fill="currentColor" />
    </svg>
  )
}

export function IconePessoa() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="5.2" r="2.1" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.6 13.2c.6-2.2 2.2-3.3 4.4-3.3s3.8 1.1 4.4 3.3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

// Cadeado simples, para o aviso de que o telefone fica guardado.
// Não recebe argumentos.
// Devolve o desenho, sem texto para o leitor de tela.
export function IconeCadeado() {
  return (
    <svg viewBox="0 0 22 22" aria-hidden="true">
      <rect x="5" y="9.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8 9.5V7.2a3 3 0 0 1 6 0v2.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconeEscudo() {
  return (
    <svg viewBox="0 0 22 22" aria-hidden="true">
      <path
        d="M11 3.2 17.5 5.5v5.2c0 3.4-2.4 5.8-6.5 7.6-4.1-1.8-6.5-4.2-6.5-7.6V5.5L11 3.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M8.2 11.1 10.1 13l3.8-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Selo de verificado em forma de roseta (a "estrelinha recortada" dos selos oficiais),
// cheia na cor do texto (currentColor), com o ✓ branco por cima.
// O ✓ tem a classe "icone-verificado__check": quem quiser outra cor muda pelo CSS.
// Não recebe argumentos. Devolve o desenho, escondido do leitor de tela.
export function IconeVerificado() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="icone-verificado">
      <polygon
        points="8.00,0.30 9.68,1.72 11.85,1.33 12.60,3.40 14.67,4.15 14.28,6.32 15.70,8.00 14.28,9.68 14.67,11.85 12.60,12.60 11.85,14.67 9.68,14.28 8.00,15.70 6.32,14.28 4.15,14.67 3.40,12.60 1.33,11.85 1.72,9.68 0.30,8.00 1.72,6.32 1.33,4.15 3.40,3.40 4.15,1.33 6.32,1.72"
        fill="currentColor"
        strokeLinejoin="round"
      />
      <path
        className="icone-verificado__check"
        d="M5.1 8.2 7.1 10.1l3.8-4.2"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconeSeta({ direcao = 'direita' }) {
  const giro = { direita: 0, esquerda: 180, baixo: 90, cima: -90 }[direcao] || 0

  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" style={{ transform: `rotate(${giro}deg)` }}>
      <path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconeVoltar() {
  return (
    <svg viewBox="0 0 22 22" aria-hidden="true">
      <path d="M13.5 5.5 7.5 11l6 5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconeCompartilhar() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 12.5V4M7 6.5 10 3.5 13 6.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10.5v5h10v-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconeAviso() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 7.2V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="8" cy="5.2" r="0.7" fill="currentColor" />
    </svg>
  )
}

export function IconeBandeira() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4.5 13.5V3.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M4.5 3.4h7L9.8 6.4l1.7 3H4.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

export function IconeCamadas() {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true">
      <path d="M7 2 12 4.5 7 7 2 4.5 7 2Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M2 7.2 7 9.7 12 7.2M2 9.6 7 12.1 12 9.6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

export function IconeLista() {
  return (
    <svg viewBox="0 0 22 22" aria-hidden="true">
      <path d="M6 6.5h10M6 11h10M6 15.5h6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconeLoja() {
  return (
    <svg viewBox="0 0 22 22" aria-hidden="true">
      <path
        d="M4.5 9.5 6 5.5h10l1.5 4v7.2a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V9.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M4.5 9.5h13M9 17.7v-4h4v4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

export function IconeFila() {
  return (
    <svg viewBox="0 0 22 22" aria-hidden="true">
      <path
        d="M6 5.5h10.5A1.5 1.5 0 0 1 18 7v9.5a1.5 1.5 0 0 1-1.5 1.5H6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M4 8h6.5M4 11h6.5M4 14h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconePainel() {
  return (
    <svg viewBox="0 0 22 22" aria-hidden="true">
      <path d="M5 16V11M11 16V6M17 16v-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconeEstrela() {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true">
      <path
        d="M7 1.8 8.3 5h3.4L9.2 7.1l1.1 3.3L7 8.6 3.7 10.4 4.8 7.1 2.3 5h3.4L7 1.8Z"
        fill="currentColor"
      />
    </svg>
  )
}

// Relógio (esperando na fila).
export function IconeRelogio() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 6.5V10l2.4 1.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Balão de conversa (retangular) com um telefone dentro: "mandar mensagem".
// Desenho próprio do ISAC Conecta, de propósito diferente do logo do WhatsApp (marca da Meta).
// Junto com o verde e a palavra "WhatsApp" no botão, a pessoa reconhece na hora.
export function IconeConversa() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8l-4.5 3.5V17H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.4 7.6c.3-.3.7-.2.9.1l.6 1.1c.2.3.1.6-.1.8l-.4.4c.4.8 1 1.4 1.8 1.8l.4-.4c.2-.2.5-.3.8-.1l1.1.6c.3.2.4.6.1.9l-.5.5c-.4.4-1.1.5-1.6.3a6.2 6.2 0 0 1-3.4-3.4c-.2-.5-.1-1.2.3-1.6l-.0-.0Z"
        fill="currentColor"
      />
    </svg>
  )
}

// Quatro quadradinhos (categorias).
export function IconeGrade() {
  return (
    <svg viewBox="0 0 22 22" aria-hidden="true">
      <path d="M4.5 4.5h5v5h-5zM12.5 4.5h5v5h-5zM4.5 12.5h5v5h-5zM12.5 12.5h5v5h-5z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

// Duas pessoas (usuários).
export function IconePessoas() {
  return (
    <svg viewBox="0 0 22 22" aria-hidden="true">
      <circle cx="8.5" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 17.5c.6-2.8 2.6-4.3 5-4.3s4.4 1.5 5 4.3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 5.4a3 3 0 0 1 0 5.2M15.6 13.5c1.5.5 2.5 1.8 2.9 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

// Porta com seta para fora (sair da conta).
export function IconeSair() {
  return (
    <svg viewBox="0 0 22 22" aria-hidden="true">
      <path d="M9 5H6.5A1.5 1.5 0 0 0 5 6.5v9A1.5 1.5 0 0 0 6.5 17H9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13 7.5 16.5 11 13 14.5M16.2 11H9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Sino (avisos do painel da equipe).
export function IconeSino() {
  return (
    <svg viewBox="0 0 22 22" aria-hidden="true">
      <path d="M6 15V10a5 5 0 0 1 10 0v5l1.5 2h-13L6 15Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9.2 19a2 2 0 0 0 3.6 0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

// Setinha de tendência (sobe). Gire 180° com CSS para "desce".
export function IconeTendencia() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 11 7 7l2.5 2.5L13 6M10 6h3v3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
