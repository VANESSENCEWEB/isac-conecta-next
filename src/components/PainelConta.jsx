// =============================================================================
// PAINEL VERDE DO LADO DO FORMULÁRIO (só no computador)
// No PI era usado no Cadastro e no Entrar da equipe; aqui, no Esqueci minha senha. Mesmo papel da animação do Entrar:
// a coluna da direita explica o que a pessoa ganha (ou o que a área faz),
// enquanto a da esquerda tem o formulário.
// No celular ele some (o formulário já é a tela inteira), veja Conta.css.
// =============================================================================

// Recebe:
//   olho:    texto pequeno em cima (ex.: "Por que criar a conta")
//   titulo:  frase grande do painel
//   itens:   lista [{ Icone, titulo, texto }] com os pontos principais
//   rodape:  (opcional) uma frase de segurança, com cadeado
//   tom:     "verde" (padrão) ou "escuro" (área da equipe)
// Devolve a <aside>. O conteúdo é texto de verdade (leitor de tela lê),
// só os ícones são decorativos.
export default function PainelConta({ olho, titulo, itens, rodape, IconeRodape, tom = 'verde' }) {
  return (
    <aside className={`conta-painel conta-painel--${tom}`} aria-label={titulo}>
      {/* Círculos decorativos, como no cartão do "Entre para publicar". */}
      <span className="conta-painel__circulo conta-painel__circulo--um" aria-hidden="true" />
      <span className="conta-painel__circulo conta-painel__circulo--dois" aria-hidden="true" />

      <div className="conta-painel__conteudo">
        <p className="conta-painel__olho">{olho}</p>
        <p className="conta-painel__titulo">{titulo}</p>

        <ul className="conta-painel__itens">
          {itens.map(({ Icone, titulo: tituloDoItem, texto }, posicao) => (
            // --ordem: cada item entra um pouco depois do anterior (Conta.css).
            <li key={tituloDoItem} style={{ '--ordem': posicao }}>
              <span className="conta-painel__icone" aria-hidden="true">
                <Icone />
              </span>
              <span>
                <strong>{tituloDoItem}</strong>
                {texto}
              </span>
            </li>
          ))}
        </ul>

        {rodape ? (
          <p className="conta-painel__rodape">
            {IconeRodape ? <IconeRodape /> : null}
            <span>{rodape}</span>
          </p>
        ) : null}
      </div>
    </aside>
  )
}
