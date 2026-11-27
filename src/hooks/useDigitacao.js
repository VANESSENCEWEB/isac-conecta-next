'use client'

import { useEffect, useState } from 'react'
import { PASSO_INICIAL, proximoPasso, textoDoPasso } from '@/utils/digitacao'

// Faz a palavra da busca "digitar e apagar" sozinha, num relógio
// ("produtos", "imóveis", "serviços"…). Veio igual do PI.
// Recebe se a animação está ligada (desligada quando a pessoa digita ou pediu menos movimento).
// Devolve o pedaço da palavra que aparece agora (ex.: "serv").
export function useDigitacao(ligada) {
  const [passo, setPasso] = useState(PASSO_INICIAL)

  // A cada passo, agenda o seguinte. Desligada, não agenda nada.
  useEffect(() => {
    if (!ligada) {
      return undefined
    }

    const { passo: seguinte, espera } = proximoPasso(passo)
    const relogio = window.setTimeout(() => setPasso(seguinte), espera)
    return () => window.clearTimeout(relogio)
  }, [passo, ligada])

  return textoDoPasso(passo)
}
