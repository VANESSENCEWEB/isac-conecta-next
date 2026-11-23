import { obterSupabase, supabaseEstaConfigurado } from '@/lib/supabase'

// =============================================================================
// SERVIÇO DAS CATEGORIAS
// Só conversa com o Supabase. Quem chama é o hook useCategorias (TanStack Query).
// Diferença para o PI: lá a função devolvia { categorias, erro }; aqui ela LANÇA o erro,
// porque é assim que o useQuery sabe que deu errado e preenche o "error" dele.
// =============================================================================

// Lista as categorias na ordem da vitrine.
// Não recebe argumentos.
// Devolve [{ id, slug, nome, ordem, ativa }]. Para quem não é da equipe, o banco já
// devolve só as ligadas (regra de segurança RLS do PI).
// Lança um Error com uma frase curta se o banco não estiver ligado ou não responder.
export async function listarCategorias() {
  if (!supabaseEstaConfigurado()) {
    throw new Error('O app ainda não está ligado ao banco.')
  }

  const { data, error } = await obterSupabase()
    .from('categorias')
    .select('id, slug, nome, ordem, ativa')
    .order('ordem')
    .order('id')

  if (error) {
    throw new Error('Não foi possível carregar as categorias. Tente de novo.')
  }

  return data || []
}
