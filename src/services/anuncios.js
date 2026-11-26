import { baseDasFotos, obterSupabase, supabaseEstaConfigurado } from '@/lib/supabase'
import { converterAnuncio, limparTextoDaBusca, tirarAcentos } from '@/utils/converterAnuncio'

// =============================================================================
// SERVIÇO DOS ANÚNCIOS
// Só conversa com o Supabase. Quem chama são os hooks de src/hooks/useAnuncios.js
// (TanStack Query). Veio do services/anuncios.js do PI, com uma diferença:
// lá as funções devolviam { anuncios, erro }; aqui elas LANÇAM o erro, porque é
// assim que o useQuery sabe que deu errado e preenche o "error" dele.
// =============================================================================

// As colunas que a vitrine e o detalhe usam. Nada de texto original, alerta da IA
// ou telefone da conta: esses ficam em tabelas que o visitante nem consegue ler.
// "categorias!inner" faz o filtro por categoria valer para a lista inteira.
// "perfis!anuncios_autor_id_fkey" diz qual ligação usar entre anúncio e perfil.
const COLUNAS_DA_VITRINE = `
  id, autor_id, titulo, descricao, preco, tipo_preco, whatsapp, bairro, cidade, detalhes,
  origem, destaque_ate, criado_em,
  categorias!inner ( slug ),
  perfis!anuncios_autor_id_fkey ( nome, verificado, criado_em, foto ),
  anuncio_fotos ( id, caminho, ordem )
`

// Quantos anúncios a vitrine traz de uma vez.
const LIMITE_DA_VITRINE = 50

// Confere se o texto tem o formato de um id do banco (uuid).
// Recebe o id da rota.
// Devolve true ou false. Assim um link quebrado vira "não encontrado", não erro.
function pareceId(id) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id || ''))
}

// Para antes de consultar se o .env.local ainda não tem a URL e a chave.
// Não recebe argumentos. Não devolve valor; lança um Error com frase curta.
function exigirBanco() {
  if (!supabaseEstaConfigurado()) {
    throw new Error('O app ainda não está ligado ao banco.')
  }
}

// Converte as linhas do banco no formato que as telas usam.
// Recebe a lista do Supabase. Devolve a lista de anúncios.
function converterLista(linhas) {
  const agora = new Date()
  const base = baseDasFotos()
  return (linhas || []).map((linha) => converterAnuncio(linha, agora, base))
}

// Lista os anúncios ativos da vitrine, do mais novo para o mais antigo.
// Recebe { busca, categoria }: o texto digitado e o slug da categoria (ou "todos").
// Devolve a lista de anúncios. O RLS deixa a pessoa logada ver os próprios pendentes,
// por isso a consulta sempre pede status = 'ativo'.
// Lança um Error se o banco não responder.
export async function listarAnuncios({ busca = '', categoria = 'todos' } = {}) {
  exigirBanco()

  let consulta = obterSupabase().from('anuncios').select(COLUNAS_DA_VITRINE).eq('status', 'ativo')

  if (categoria && categoria !== 'todos') {
    consulta = consulta.eq('categorias.slug', categoria)
  }

  const texto = limparTextoDaBusca(busca)

  if (texto) {
    // busca_texto = título + descrição sem acento (migration 019 do PI):
    // "fogao" acha "Fogão".
    consulta = consulta.ilike('busca_texto', `%${tirarAcentos(texto)}%`)
  }

  const { data, error } = await consulta.order('criado_em', { ascending: false }).limit(LIMITE_DA_VITRINE)

  if (error) {
    throw new Error('Não foi possível carregar os anúncios. Tente de novo.')
  }

  return converterLista(data)
}

// Busca um anúncio pelo id, para a tela de detalhe.
// Recebe o id da rota (/anuncio/<id>).
// Devolve o anúncio, ou null se ele não existir (ou não estiver visível para quem vê).
// Lança um Error se o banco não responder.
export async function buscarAnuncio(id) {
  if (!pareceId(id)) {
    return null
  }

  exigirBanco()

  const { data, error } = await obterSupabase()
    .from('anuncios')
    .select(COLUNAS_DA_VITRINE)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw new Error('Não foi possível carregar o anúncio. Tente de novo.')
  }

  return data ? converterAnuncio(data, new Date(), baseDasFotos()) : null
}
