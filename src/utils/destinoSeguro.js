// =============================================================================
// DESTINO SEGURO DEPOIS DE ENTRAR
// Quem abre um convite e ainda não entrou vai para /entrar?voltar=/convite/CODIGO.
// Depois do login, o app volta para lá. Só aceitamos caminhos DENTRO do próprio site:
// um link maldoso como ?voltar=https://site-falso.com não pode levar a pessoa para fora.
// =============================================================================

// Confere o caminho de volta.
// Recebe o valor de ?voltar= (texto ou null).
// Devolve o caminho, se for do próprio site, ou "/" (a vitrine).
export function destinoSeguro(valor) {
  const caminho = String(valor || '')

  // Precisa começar com uma barra só ("//site.com" e "/\site.com" levam para fora).
  if (!/^\/(?![/\\])/.test(caminho)) {
    return '/'
  }

  // Só letras, números e os símbolos de um caminho comum.
  return /^[A-Za-z0-9/_\-?=&.%]+$/.test(caminho) ? caminho : '/'
}

// Monta o link de entrar (ou de criar conta) que volta para o caminho atual.
// Recebe a tela ("/entrar" ou "/cadastro") e o caminho de volta.
// Devolve o link com ?voltar=, ou só a tela quando a volta seria a vitrine.
export function linkComVolta(tela, voltar) {
  const destino = destinoSeguro(voltar)
  return destino === '/' ? tela : `${tela}?voltar=${encodeURIComponent(destino)}`
}
