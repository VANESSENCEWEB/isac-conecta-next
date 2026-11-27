'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usePathname, useRouter } from 'next/navigation'
import { listarFavoritos, removerFavorito, salvarFavorito } from '@/services/favoritos'
import { useSessaoStore } from '@/store/useSessaoStore'
import { linkComVolta } from '@/utils/destinoSeguro'

// =============================================================================
// FAVORITOS (o coração): junta as três ideias do projeto.
//   • Zustand: quem está logado (useSessaoStore). Visitante não salva.
//   • TanStack Query: useQuery lê os ids salvos; useMutation salva ou remove.
//     O coração muda NA HORA (atualização otimista) e volta atrás se o banco recusar.
//   • Next Router: o visitante que toca no coração vai para /entrar e, depois de
//     entrar, volta para a mesma página (?voltar=).
// No PI isto era um Context (ProvedorFavoritos) com useEffect + useState.
// =============================================================================

// Chave dos favoritos no cache. Leva o id da conta: trocar de conta não mistura os salvos.
function chaveDosFavoritos(pessoaId) {
  return ['favoritos', pessoaId]
}

// Não recebe argumentos.
// Devolve { estaFavorito(id), alternarFavorito(id), erroFavoritos }.
export function useFavoritos() {
  const conta = useSessaoStore((estado) => estado.conta)
  const pessoaId = conta?.id || null
  const clienteQuery = useQueryClient()
  const router = useRouter()
  const caminho = usePathname()
  const chave = chaveDosFavoritos(pessoaId)

  const { data: ids = [] } = useQuery({
    queryKey: chave,
    queryFn: listarFavoritos,
    enabled: Boolean(pessoaId),
  })

  const mutacao = useMutation({
    // Recebe { anuncioId, salvar }: salvar true grava, false apaga.
    mutationFn: ({ anuncioId, salvar }) =>
      salvar ? salvarFavorito({ pessoaId, anuncioId }) : removerFavorito({ pessoaId, anuncioId }),

    // Antes de ir ao banco: troca o coração na tela e guarda a lista antiga.
    onMutate: async ({ anuncioId, salvar }) => {
      await clienteQuery.cancelQueries({ queryKey: chave })
      const anterior = clienteQuery.getQueryData(chave) || []
      const nova = salvar ? [...anterior, anuncioId] : anterior.filter((id) => id !== anuncioId)
      clienteQuery.setQueryData(chave, nova)
      return { anterior }
    },

    // O banco recusou: devolve a lista como estava.
    onError: (_erro, _variaveis, contexto) => {
      clienteQuery.setQueryData(chave, contexto?.anterior || [])
    },

    // Deu certo ou errado, confere com o banco no fim.
    onSettled: () => clienteQuery.invalidateQueries({ queryKey: chave }),
  })

  // Diz se o anúncio está salvo. Recebe o id. Devolve true ou false.
  function estaFavorito(anuncioId) {
    return ids.includes(anuncioId)
  }

  // Salva ou tira dos salvos. Visitante vai para o Entrar.
  // Recebe o id do anúncio. Não devolve valor.
  function alternarFavorito(anuncioId) {
    if (!pessoaId) {
      router.push(linkComVolta('/entrar', caminho))
      return
    }

    mutacao.mutate({ anuncioId, salvar: !estaFavorito(anuncioId) })
  }

  return {
    estaFavorito,
    alternarFavorito,
    erroFavoritos: mutacao.isError ? mutacao.error.message : '',
  }
}
