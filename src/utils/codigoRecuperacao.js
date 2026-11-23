// =============================================================================
// CÓDIGO DE RECUPERAÇÃO (D25)
// Funções pequenas para o que a pessoa digita e para o que a tela mostra.
// O código tem 12 letras e números, mostrado assim: K7QM-4TXD-9HWB.
// Quem sorteia, guarda e confere o código é o banco (migration 018), nunca o front.
// =============================================================================

// Quantos caracteres tem o código, sem os hífens.
export const TAMANHO_DO_CODIGO = 12

// Deixa só letras e números, em maiúsculas, no máximo 12.
// Recebe o texto como a pessoa digitou ou colou (aceita minúsculas, espaços e hífens).
// Devolve, por exemplo, "K7QM4TXD9HWB".
export function limparCodigo(texto) {
  return String(texto || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, TAMANHO_DO_CODIGO)
}

// Põe os hífens de 4 em 4 enquanto a pessoa digita.
// Recebe o texto do campo.
// Devolve, por exemplo, "K7QM-4TXD" para "k7qm4txd".
export function mascararCodigo(texto) {
  const limpo = limparCodigo(texto)

  return [limpo.slice(0, 4), limpo.slice(4, 8), limpo.slice(8, 12)].filter(Boolean).join('-')
}

// Diz se o código já tem os 12 caracteres.
// Recebe o texto do campo.
// Devolve true quando está completo (a conferência de verdade é feita no banco).
export function codigoCompleto(texto) {
  return limparCodigo(texto).length === TAMANHO_DO_CODIGO
}

// Explica o que está faltando no campo do código.
// Recebe o texto do campo.
// Devolve a frase de erro, ou vazio quando está completo.
export function erroDoCodigo(texto) {
  if (!limparCodigo(texto)) {
    return 'Digite o código de recuperação.'
  }

  if (!codigoCompleto(texto)) {
    return 'O código tem 12 letras e números.'
  }

  return ''
}

// Traduz o erro de gerar o código para uma frase que a pessoa entende.
// Recebe o erro do Supabase (ou um texto).
// Devolve a frase. Não devolve código de erro, SQL nem dados da conta.
export function mensagemDeGerarCodigo(erro) {
  const texto = String(erro?.message || erro || '').toLowerCase()

  if (texto.includes('failed to fetch') || texto.includes('network') || texto.includes('load failed')) {
    return 'Sem conexão. Verifique a internet e tente de novo.'
  }

  if (texto.includes('espere um minuto')) {
    return 'Espere um minuto para gerar outro código.'
  }

  if (texto.includes('entre na sua conta') || texto.includes('jwt')) {
    return 'Entre na sua conta para gerar o código de recuperação.'
  }

  return 'Não deu para gerar o código agora. Tente de novo em instantes.'
}
