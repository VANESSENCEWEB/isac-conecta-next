'use client'

import { useEffect, useState } from 'react'

// Devolve o valor só depois que ele para de mudar por um tempo.
// A vitrine usa para não consultar o banco a cada letra digitada na busca.
// Recebe o valor e a espera em milissegundos. Devolve o último valor "parado".
export function useComPausa(valor, espera) {
  const [valorParado, setValorParado] = useState(valor)

  useEffect(() => {
    const relogio = setTimeout(() => setValorParado(valor), espera)
    return () => clearTimeout(relogio)
  }, [valor, espera])

  return valorParado
}
