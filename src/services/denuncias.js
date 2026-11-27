import { obterSupabase, supabaseEstaConfigurado } from '@/lib/supabase'

// =============================================================================
// SERVIÇO DAS DENÚNCIAS (só o "Denunciar anúncio" do detalhe)
// Veio do services/denuncias.js do PI. A tela da equipe (moderação) ficou no PI.
// Funciona com ou sem conta: a função denunciar_anuncio do banco (migration 010)
// confere tudo e grava. Aqui ela LANÇA o erro, para o useMutation entender.
// =============================================================================

// Frases que o próprio banco escreve para a pessoa (já em português, sem detalhe técnico).
const MENSAGENS_DO_BANCO = ['já denunciou', 'próprio anúncio', 'não está no ar', 'muitas denúncias', 'Escolha']

// Traduz o erro do banco numa frase curta.
// Recebe o erro. Devolve a frase.
function mensagemDoErro(erro) {
  const texto = String(erro?.message || '')

  if (MENSAGENS_DO_BANCO.some((trecho) => texto.includes(trecho))) {
    return texto
  }

  if (/failed to fetch|network|load failed/i.test(texto)) {
    return 'Sem conexão. Verifique a internet e tente de novo.'
  }

  return 'Não foi possível enviar a denúncia agora. Tente de novo.'
}

// Manda a denúncia de um anúncio para a equipe do ISAC.
// Recebe { anuncioId, motivo, detalhe }.
// Não devolve valor. Lança um Error com a frase se o banco recusar.
export async function denunciarAnuncio({ anuncioId, motivo, detalhe = '' }) {
  if (!supabaseEstaConfigurado()) {
    throw new Error('O app ainda não está ligado ao banco.')
  }

  const { error } = await obterSupabase().rpc('denunciar_anuncio', {
    p_anuncio_id: anuncioId,
    p_motivo: motivo,
    p_detalhe: detalhe.trim() || null,
  })

  if (error) {
    throw new Error(mensagemDoErro(error))
  }
}
