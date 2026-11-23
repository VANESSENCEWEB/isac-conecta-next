'use client'

import { useSyncExternalStore } from 'react'

const CONSULTA = '(prefers-reduced-motion: reduce)'

// Avisa o React quando a preferência do aparelho muda.
// Recebe a função que o React quer chamar. Devolve a função de parar de escutar.
function escutar(avisar) {
  const lista = window.matchMedia(CONSULTA)
  lista.addEventListener('change', avisar)
  return () => lista.removeEventListener('change', avisar)
}

// Diz se a pessoa pediu "menos movimento" nas configurações do aparelho.
// Não recebe argumentos. Devolve true ou false.
// No servidor não existe "window", então lá a resposta é sempre false
// (o terceiro argumento); o navegador corrige assim que a página abre, sem erro de hidratação.
export function usePrefereMenosMovimento() {
  return useSyncExternalStore(
    escutar,
    () => window.matchMedia(CONSULTA).matches,
    () => false,
  )
}
