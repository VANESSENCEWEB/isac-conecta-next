import { create } from 'zustand'

// =============================================================================
// FILTROS DA VITRINE (Zustand): a categoria escolhida e o texto da busca.
// Ficam numa store global para não se perderem ao abrir um anúncio e voltar,
// e para o cabeçalho (busca) e a vitrine (lista) lerem o mesmo valor.
// =============================================================================
export const useFiltrosStore = create((set) => ({
  // Slug da categoria escolhida ("produtos", "vagas"...), ou "todos".
  categoria: 'todos',
  // O texto da busca do cabeçalho, letra por letra (a Vitrine espera a pausa antes de consultar).
  busca: '',

  // Troca a categoria. Recebe o slug. Não devolve valor.
  escolherCategoria: (categoria) => set({ categoria }),

  // Troca o texto da busca. Recebe o texto. Não devolve valor.
  mudarBusca: (busca) => set({ busca }),

  // Volta tudo ao começo. Não recebe argumentos. Não devolve valor.
  limparFiltros: () => set({ categoria: 'todos', busca: '' }),
}))
