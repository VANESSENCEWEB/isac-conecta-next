import { useState } from 'react'
import './Conta.css'

// Olho aberto ou riscado, para mostrar e esconder a senha.
// Recebe se a senha está visível.
// Devolve o desenho, sem texto para o leitor de tela.
function IconeOlho({ aberto }) {
  if (aberto) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M3 3l18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M9.9 9.9A3.2 3.2 0 0 0 14 14M6.1 6.4C4.2 7.6 2.8 9.4 2 12c1.6 4.2 5.4 7 10 7 1.7 0 3.3-.4 4.7-1.1M10 5.1A10.6 10.6 0 0 1 12 5c4.6 0 8.4 2.8 10 7-.5 1.3-1.2 2.5-2.1 3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M2 12c1.6-4.2 5.4-7 10-7s8.4 2.8 10 7c-1.6 4.2-5.4 7-10 7s-8.4-2.8-10-7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

// Campo de texto com rótulo, ajuda e, se já for hora, o erro.
// Recebe o id, o rótulo, o valor, a mudança, o que fazer ao sair, o placeholder,
// a ajuda, o erro, um miolo extra, o autocomplete, o teclado, o tamanho e o tipo.
// Devolve o rótulo e o campo. O erro só aparece se quem chama já decidiu mostrar.
export function Campo({
  id,
  rotulo,
  valor,
  onChange,
  onBlur,
  placeholder,
  ajuda,
  erro = '',
  extra = null,
  autoComplete,
  inputMode,
  maxLength,
  tipo = 'text',
  className = '',
}) {
  const idErro = `${id}-erro`

  return (
    <div className={['campo', erro ? 'campo--invalido' : '', className].filter(Boolean).join(' ')}>
      <label htmlFor={id}>{rotulo}</label>
      <input
        id={id}
        type={tipo}
        value={valor}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={erro ? 'true' : undefined}
        aria-describedby={erro ? idErro : undefined}
        onBlur={onBlur}
        onChange={(evento) => onChange(evento.target.value)}
      />
      {erro ? <p className="campo__erro" id={idErro}>{erro}</p> : null}
      {ajuda ? <p className="campo__ajuda">{ajuda}</p> : null}
      {extra}
    </div>
  )
}

// Campo de senha com botão para mostrar o texto.
// Recebe o id, o rótulo, o valor, a mudança, o que fazer ao sair, o placeholder,
// a ajuda, o erro, um miolo extra (o checklist) e o autocomplete.
// Devolve o campo e o botão do olho.
export function CampoSenha({
  id,
  rotulo,
  valor,
  onChange,
  onBlur,
  placeholder,
  ajuda,
  erro = '',
  extra = null,
  autoComplete,
}) {
  const [visivel, setVisivel] = useState(false)
  const idErro = `${id}-erro`

  return (
    <div className={erro ? 'campo campo--invalido' : 'campo'}>
      <label htmlFor={id}>{rotulo}</label>
      <div className="campo__senha">
        <input
          id={id}
          type={visivel ? 'text' : 'password'}
          value={valor}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={erro ? 'true' : undefined}
          aria-describedby={erro ? idErro : undefined}
          onBlur={onBlur}
          onChange={(evento) => onChange(evento.target.value)}
        />
        <button
          type="button"
          className="campo__olho"
          aria-label={visivel ? 'Esconder senha' : 'Mostrar senha'}
          aria-pressed={visivel}
          onClick={() => setVisivel((atual) => !atual)}
        >
          <IconeOlho aberto={visivel} />
        </button>
      </div>
      {erro ? <p className="campo__erro" id={idErro}>{erro}</p> : null}
      {ajuda ? <p className="campo__ajuda">{ajuda}</p> : null}
      {extra}
    </div>
  )
}
