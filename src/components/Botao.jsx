import './Botao.css'

// Desenha a seta que acompanha o texto do botão.
// Não recebe argumentos.
// Devolve o ícone, na cor do texto do botão.
function IconeSeta() {
  return (
    <svg className="botao__icone" viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M4 10h10M10 5l5 5-5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Monta a classe CSS a partir do tipo e do estado.
// Recebe o tipo (primario, destaque, secundario, cancelar, link, perigo, perigo-contorno),
// se está desabilitado e se a amostra deve parecer pressionada.
// Devolve a string de classes.
function classesDoBotao(tipo, desabilitado, pressionado) {
  const classes = ['botao', `botao--${tipo}`]

  if (desabilitado) {
    classes.push('botao--desabilitado')
  }

  if (pressionado && !desabilitado) {
    classes.push('botao--pressionado')
  }

  return classes.join(' ')
}

// Botão das telas. O tipo muda a cor; o estado desabilitado fica cinza com contorno.
// Recebe o tipo, o texto (children), se mostra a seta, se está desabilitado,
// se a amostra está pressionada, o tipo do botão HTML, uma classe extra, o rótulo para leitor de tela
// (quando o texto na tela é mais curto que o nome completo da ação) e o clique.
// Devolve o elemento button.
export default function Botao({
  tipo = 'primario',
  children,
  icone = false,
  desabilitado = false,
  pressionado = false,
  type = 'button',
  className = '',
  rotuloAcessivel,
  onClick,
}) {
  const classes = [classesDoBotao(tipo, desabilitado, pressionado), className].filter(Boolean).join(' ')

  return (
    <button
      className={classes}
      type={type}
      disabled={desabilitado}
      aria-label={rotuloAcessivel}
      onClick={onClick}
    >
      {children}
      {icone ? <IconeSeta /> : null}
    </button>
  )
}
