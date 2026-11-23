import { create } from 'zustand'

// =============================================================================
// SESSÃO (Zustand): quem está logado. Substitui o ProvedorSessao (Context) do PI.
// Qualquer componente lê com useSessaoStore((estado) => estado.conta), sem Provider.
// Quem preenche é o OuvirSessao.jsx, que escuta o Supabase Auth.
// =============================================================================
export const useSessaoStore = create((set) => ({
  // null = visitante. Quem entrou: { id, nome, bairro, papel, telefone }.
  conta: null,

  // true até o Supabase dizer se tem alguém logado (na primeira abertura da página).
  // Serve para o cabeçalho não mostrar "Entrar" por um instante para quem já está logado.
  carregando: true,

  // Guarda a conta de quem entrou (ou que o Supabase lembrou ao abrir a página).
  // Recebe { id, nome, bairro, papel, telefone }. Não devolve valor.
  guardarConta: (conta) => set({ conta, carregando: false }),

  // Esquece a conta (logout, ou ninguém logado). Não recebe argumentos. Não devolve valor.
  esquecerConta: () => set({ conta: null, carregando: false }),
}))
