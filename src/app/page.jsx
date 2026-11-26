import Vitrine from '@/components/Vitrine'

// Página inicial: a vitrine do bairro.
// Este arquivo é Server Component; a Vitrine é 'use client' porque usa
// o Zustand (filtros) e o TanStack Query (anúncios), que vivem no navegador.
export default function Home() {
  return <Vitrine />
}
