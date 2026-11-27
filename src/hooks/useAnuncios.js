'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { buscarAnuncio, buscarWhatsappConfirmado, listarAnuncios, listarSemelhantes } from '@/services/anuncios'

// Começo da chave dos anúncios no cache do TanStack Query.
// No Dia 5, depois de criar, editar ou apagar um anúncio, o useMutation invalida
// tudo que começa com ['anuncios'] e a vitrine e o detalhe se atualizam sozinhos.
export const CHAVE_ANUNCIOS = ['anuncios']

// Busca a lista da vitrine com os filtros escolhidos.
// Recebe { busca, categoria } (vêm do Zustand, em useFiltrosStore).
// Devolve o resultado do useQuery: { data, isPending, isError, error, refetch, isFetching }.
// Os filtros entram na chave: cada combinação fica guardada no cache, então voltar
// para um filtro já visto mostra a lista na hora.
// keepPreviousData: ao trocar de filtro, a lista antiga fica na tela até a nova chegar,
// em vez de piscar o "Carregando".
export function useAnuncios({ busca = '', categoria = 'todos' } = {}) {
  return useQuery({
    queryKey: [...CHAVE_ANUNCIOS, 'lista', { busca, categoria }],
    queryFn: () => listarAnuncios({ busca, categoria }),
    placeholderData: keepPreviousData,
  })
}

// Busca um anúncio para a tela de detalhe.
// Recebe o id da rota.
// Devolve o resultado do useQuery. data é o anúncio, ou null se não existir.
export function useAnuncio(id) {
  return useQuery({
    queryKey: [...CHAVE_ANUNCIOS, 'um', id],
    queryFn: () => buscarAnuncio(id),
    enabled: Boolean(id),
  })
}

// Busca os "anúncios parecidos" do fim do detalhe.
// Recebe o anúncio aberto (ou undefined enquanto ele carrega).
// Devolve o resultado do useQuery. Só busca depois que o anúncio chegou.
export function useSemelhantes(anuncio) {
  return useQuery({
    queryKey: [...CHAVE_ANUNCIOS, 'semelhantes', anuncio?.id],
    queryFn: () => listarSemelhantes(anuncio),
    enabled: Boolean(anuncio?.id),
  })
}

// Busca o sim/não "WhatsApp confirmado" de quem anunciou.
// Recebe o id de quem anunciou. Devolve o resultado do useQuery (data: true, false ou null).
export function useWhatsappConfirmado(autorId) {
  return useQuery({
    queryKey: ['perfis', 'whatsapp-confirmado', autorId],
    queryFn: () => buscarWhatsappConfirmado(autorId),
    enabled: Boolean(autorId),
  })
}
