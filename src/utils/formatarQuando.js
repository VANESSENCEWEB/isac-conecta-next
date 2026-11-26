// Transforma "há quantas horas" no texto curto do card.
// Recebe a quantidade de horas.
// Devolve "há 2 h", "ontem" ou "há 3 dias".
export function formatarQuando(horasAtras) {
  if (horasAtras < 1) {
    return 'agora há pouco'
  }

  if (horasAtras < 24) {
    return `há ${horasAtras} h`
  }

  if (horasAtras < 48) {
    return 'ontem'
  }

  const dias = Math.floor(horasAtras / 24)
  return `há ${dias} dias`
}
