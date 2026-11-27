import { obterSupabase, supabaseEstaConfigurado } from '@/lib/supabase'

// =============================================================================
// SERVIÇO DOS FAVORITOS (o coração dos cards e do detalhe)
// Veio do services/favoritos.js do PI. Só a pessoa logada salva: o RLS garante que
// cada um só lê, cria e apaga os próprios favoritos (migration 003 do PI).
// Diferença para o PI: as funções LANÇAM o erro, para o TanStack Query entender.
// =============================================================================

// Lista os ids dos anúncios que a pessoa salvou.
// Não recebe argumentos (o RLS já filtra pela conta logada).
// Devolve uma lista de ids. Lança um Error se o banco não responder.
export async function listarFavoritos() {
  if (!supabaseEstaConfigurado()) {
    return []
  }

  const { data, error } = await obterSupabase().from('favoritos').select('anuncio_id')

  if (error) {
    throw new Error('Não foi possível carregar os salvos.')
  }

  return (data || []).map((linha) => linha.anuncio_id)
}

// Salva um anúncio. Salvar duas vezes não é erro.
// Recebe { pessoaId, anuncioId }. Não devolve valor. Lança um Error se não der.
export async function salvarFavorito({ pessoaId, anuncioId }) {
  const { error } = await obterSupabase()
    .from('favoritos')
    .upsert({ perfil_id: pessoaId, anuncio_id: anuncioId }, { onConflict: 'perfil_id,anuncio_id', ignoreDuplicates: true })

  if (error) {
    throw new Error('Não foi possível salvar agora.')
  }
}

// Tira um anúncio dos salvos.
// Recebe { pessoaId, anuncioId }. Não devolve valor. Lança um Error se não der.
export async function removerFavorito({ pessoaId, anuncioId }) {
  const { error } = await obterSupabase()
    .from('favoritos')
    .delete()
    .eq('perfil_id', pessoaId)
    .eq('anuncio_id', anuncioId)

  if (error) {
    throw new Error('Não foi possível remover agora.')
  }
}
