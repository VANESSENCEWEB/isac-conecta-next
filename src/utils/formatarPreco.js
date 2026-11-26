// Monta o texto do preço do jeito combinado no projeto.
// Recebe o anúncio (preco, tipoPreco e, se for diária, o sufixo).
// Devolve um objeto com o texto principal e um sufixo opcional, como " / diária".
export function formatarPreco(anuncio) {
  if (anuncio.tipoPreco === 'gratis' || anuncio.preco === 0) {
    return { principal: 'Grátis', sufixo: '' }
  }

  if (anuncio.tipoPreco === 'salario') {
    return { principal: 'Salário a combinar', sufixo: '' }
  }

  if (anuncio.tipoPreco === 'a_combinar' || anuncio.preco == null) {
    return { principal: 'A combinar', sufixo: '' }
  }

  const principal = anuncio.preco.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })

  const sufixo = anuncio.tipoPreco === 'diaria' ? anuncio.sufixoPreco || ' / diária' : ''

  return { principal, sufixo }
}

// Número usado só para ordenar. "A combinar" e salário vão para o fim.
// Recebe o anúncio.
// Devolve um número.
export function precoParaOrdenar(anuncio) {
  if (anuncio.preco == null) {
    return Number.POSITIVE_INFINITY
  }

  return anuncio.preco
}
