// =============================================================================
// EFEITO DE DIGITAÇÃO (busca do cabeçalho)
// "Buscar produtos" → apaga → "Buscar imóveis" → apaga → "Buscar serviços"…
// Funções puras: recebem o passo atual e devolvem o próximo, com quanto tempo esperar.
// Veio igual do PI. O hook useDigitacao só chama "proximoPasso" num relógio.
// =============================================================================

// As palavras que aparecem depois de "Buscar", na ordem do Figma.
export const PALAVRAS_DA_BUSCA = ['produtos', 'imóveis', 'serviços', 'vagas']

// Tempos, em milissegundos.
export const TEMPOS_DA_DIGITACAO = {
  letra: 90, // escrever cada letra
  apagar: 45, // apagar cada letra (mais rápido, como uma pessoa)
  pausaCheia: 1600, // a palavra inteira fica parada para dar tempo de ler
  pausaVazia: 300, // respiro antes da próxima palavra
}

// O começo: primeira palavra, nenhuma letra, escrevendo.
export const PASSO_INICIAL = { indice: 0, letras: 0, apagando: false }

// Calcula o próximo passo da digitação.
// Recebe o passo atual { indice, letras, apagando } e a lista de palavras.
// Devolve { passo, espera }: o novo passo e quantos ms esperar até o seguinte.
export function proximoPasso(passo, palavras = PALAVRAS_DA_BUSCA) {
  const palavra = palavras[passo.indice] || ''

  if (!passo.apagando) {
    if (passo.letras < palavra.length) {
      return { passo: { ...passo, letras: passo.letras + 1 }, espera: TEMPOS_DA_DIGITACAO.letra }
    }

    return { passo: { ...passo, apagando: true }, espera: TEMPOS_DA_DIGITACAO.pausaCheia }
  }

  if (passo.letras > 0) {
    return { passo: { ...passo, letras: passo.letras - 1 }, espera: TEMPOS_DA_DIGITACAO.apagar }
  }

  const proximo = (passo.indice + 1) % palavras.length
  return { passo: { indice: proximo, letras: 0, apagando: false }, espera: TEMPOS_DA_DIGITACAO.pausaVazia }
}

// O pedaço da palavra que aparece neste passo.
// Recebe o passo e a lista de palavras.
// Devolve o texto, por exemplo "imó" no meio de "imóveis".
// Usa Array.from para não cortar letra acentuada pela metade.
export function textoDoPasso(passo, palavras = PALAVRAS_DA_BUSCA) {
  return Array.from(palavras[passo.indice] || '').slice(0, passo.letras).join('')
}
