'use client'

import { useQuery } from '@tanstack/react-query'
import { listarCategorias } from '@/services/categorias'

// Chave das categorias no cache do TanStack Query.
// No Dia 6, depois de criar, editar ou apagar uma categoria, o useMutation
// invalida esta chave e a lista se atualiza sozinha em todas as telas.
export const CHAVE_CATEGORIAS = ['categorias']

// Busca as categorias com o TanStack Query.
// Não recebe argumentos.
// Devolve o resultado do useQuery: { data, isPending, isError, error, refetch, ... }.
// No PI isto era um useEffect + useState; o useQuery cuida sozinho de "carregando",
// do erro e do cache (trocar de tela e voltar não busca de novo por 1 minuto).
export function useCategorias() {
  return useQuery({
    queryKey: CHAVE_CATEGORIAS,
    queryFn: listarCategorias,
  })
}
