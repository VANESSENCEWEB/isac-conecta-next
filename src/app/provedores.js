'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Envolve o site todo com o TanStack Query.
// Precisa de 'use client' porque o QueryClientProvider guarda estado no navegador.
// O layout.js (que é Server Component) importa este arquivo e coloca em volta das páginas.
export default function Provedores({ children }) {
  // useState garante um único QueryClient por visitante, criado só uma vez.
  const [clienteQuery] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Por 1 minuto o dado buscado é considerado novo: trocar de tela e voltar não busca de novo.
            staleTime: 60 * 1000,
          },
        },
      }),
  )

  return <QueryClientProvider client={clienteQuery}>{children}</QueryClientProvider>
}
