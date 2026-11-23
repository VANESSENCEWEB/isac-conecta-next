import { create } from 'zustand'

// =============================================================================
// SESSÃO (Zustand): quem está logado. Substitui o ProvedorSessao (Context) do PI.
// Qualquer componente lê com useSessaoStore((estado) => estado.conta), sem Provider.
// No Dia 3, o login chama entrar(conta) e o "Sair" chama sair().
// =============================================================================
export const useSessaoStore = create((set) => ({
  // null = visitante. Quem entrou: { id, nome, papel }.
  conta: null,

  // Guarda a conta de quem acabou de entrar.
  // Recebe { id, nome, papel }. Não devolve valor.
  entrar: (conta) => set({ conta }),

  // Esquece a conta (depois do logout). Não recebe argumentos. Não devolve valor.
  sair: () => set({ conta: null }),
}))
