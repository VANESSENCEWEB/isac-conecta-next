// Coloca os anúncios do mesmo bairro na frente, mantendo a ordem de "mais novos" dentro de cada grupo.
// Recebe a lista e o bairro do anúncio que está aberto.
// Devolve uma lista nova (sem mexer na original).
export function ordenarSemelhantes(lista, bairro) {
  const mesmoBairro = lista.filter((item) => item.bairro === bairro)
  const outros = lista.filter((item) => item.bairro !== bairro)
  return [...mesmoBairro, ...outros]
}
