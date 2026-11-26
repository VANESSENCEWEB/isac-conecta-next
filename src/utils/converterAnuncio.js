// =============================================================================
// CONVERTER O ANÚNCIO DO BANCO PARA O FORMATO DAS TELAS
//
// O banco guarda os nomes em snake_case (tipo_preco, criado_em) e as fotos,
// a categoria e quem anunciou em outras tabelas. As telas (CardAnuncio,
// CardDestaque, Detalhe) já esperam um objeto pronto, no mesmo formato que os
// dados de exemplo usavam. Este arquivo faz essa ponte, sem falar com o Supabase.
// Por isso dá para testar sem internet: converterAnuncio.test.js.
// =============================================================================

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

const TEXTO_DO_GRUPO =
  'Veio do grupo do bairro e só foi publicado depois que a própria pessoa autorizou, pelo convite do ISAC. A equipe revisou o anúncio, mas quem anuncia ainda não é verificado.'

// Quantas horas se passaram desde a data do banco.
// Recebe a data em texto (ISO) e "agora" (dá para mudar nos testes).
// Devolve um número inteiro de horas, nunca negativo.
export function horasDesde(dataIso, agora = new Date()) {
  const data = new Date(dataIso)

  if (Number.isNaN(data.getTime())) {
    return 0
  }

  const horas = Math.floor((agora.getTime() - data.getTime()) / 3600000)
  return Math.max(0, horas)
}

// Escreve uma data como "set/2026", para "verificado desde".
// Recebe a data em texto (ISO).
// Devolve o texto, ou vazio se a data não for válida.
export function mesEAno(dataIso) {
  const data = new Date(dataIso)

  if (Number.isNaN(data.getTime())) {
    return ''
  }

  return `${MESES[data.getMonth()]}/${data.getFullYear()}`
}

// Diz se o destaque pago ainda vale.
// Recebe a data de fim do destaque (ou null) e "agora".
// Devolve true quando a data existe e ainda não passou.
export function destaqueEstaValendo(destaqueAte, agora = new Date()) {
  if (!destaqueAte) {
    return false
  }

  const fim = new Date(destaqueAte)
  return !Number.isNaN(fim.getTime()) && fim.getTime() > agora.getTime()
}

// Só aceita foto que seja:
//   • um caminho do próprio site ("/fotos/fogao.jpg", as fotos da demo);
//   • uma foto do Storage ("<id da conta>/<id da foto>.webp"), que vira o endereço público;
//   • um endereço https.
// Qualquer outra coisa (javascript:, data:, http:) é ignorada.
// Recebe o caminho guardado no banco e o endereço público da pasta de fotos do Storage.
// Devolve o endereço seguro, ou vazio.
export function caminhoSeguroDaFoto(caminho, baseDasFotos = '') {
  const texto = String(caminho || '').trim()

  if (texto.startsWith('/') && !texto.startsWith('//')) {
    return texto
  }

  if (/^[0-9a-f-]{36}\/[0-9a-f-]{36}\.(webp|jpg)$/.test(texto)) {
    return baseDasFotos ? `${baseDasFotos}${texto}` : ''
  }

  if (texto.startsWith('https://')) {
    return texto
  }

  return ''
}

// Coloca as fotos na ordem (0 a 3) e tira as que não são seguras.
// Recebe a lista de { id, caminho, ordem } que veio de anuncio_fotos e a base do Storage.
// Devolve [{ id, caminho, ordem, url }], em ordem.
export function fotosOrdenadas(fotos, baseDasFotos = '') {
  return [...(fotos || [])]
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
    .map((foto) => ({ id: foto.id, caminho: foto.caminho, ordem: foto.ordem ?? 0, url: caminhoSeguroDaFoto(foto.caminho, baseDasFotos) }))
    .filter((foto) => foto.url)
}

// Garante que os detalhes sejam uma lista de { rotulo, valor } com texto.
// Recebe o jsonb "detalhes" do banco.
// Devolve a lista limpa (no máximo 8 itens, como o banco permite).
function limparDetalhes(detalhes) {
  if (!Array.isArray(detalhes)) {
    return []
  }

  return detalhes
    .filter((item) => item && typeof item.rotulo === 'string' && typeof item.valor === 'string')
    .slice(0, 8)
    .map((item) => ({ rotulo: item.rotulo, valor: item.valor }))
}

// Transforma o preço do banco (texto "250.00" ou número) em número.
// Recebe o valor do banco.
// Devolve o número, ou null para "A combinar".
function converterPreco(preco) {
  if (preco === null || preco === undefined || preco === '') {
    return null
  }

  const numero = Number(preco)
  return Number.isFinite(numero) ? numero : null
}

// Converte uma linha do banco no anúncio que as telas usam.
// Recebe a linha com: categorias { slug }, perfis { nome, verificado, criado_em }
// e anuncio_fotos [{ id, caminho, ordem }]. Recebe também "agora" (para os testes)
// e o endereço público da pasta de fotos do Storage (vem de lib/supabase.js).
// Devolve o objeto do anúncio. Não traz telefone de ninguém além do WhatsApp do anúncio.
export function converterAnuncio(linha, agora = new Date(), baseDasFotos = '') {
  const listaDeFotos = fotosOrdenadas(linha.anuncio_fotos, baseDasFotos)
  const perfil = linha.perfis || {}
  const nome = perfil.nome || 'Morador do bairro'
  const verificado = Boolean(perfil.verificado)

  return {
    id: linha.id,
    // Quem anunciou: só serve para perguntar ao banco o sim/não "WhatsApp confirmado".
    autorId: linha.autor_id || '',
    titulo: linha.titulo || '',
    descricao: linha.descricao || '',
    categoria: linha.categorias?.slug || 'produtos',
    preco: converterPreco(linha.preco),
    tipoPreco: linha.tipo_preco || 'valor',
    whatsapp: linha.whatsapp || '',
    bairro: linha.bairro || '',
    cidade: linha.cidade || 'Cabo de Santo Agostinho',
    distanciaKm: null, // a distância volta quando entrar o "Perto de mim" (localização)
    horasAtras: horasDesde(linha.criado_em, agora),
    destaque: destaqueEstaValendo(linha.destaque_ate, agora),
    verificado,
    nomeAnunciante: nome,
    apelido: nome,
    desde: verificado ? mesEAno(perfil.criado_em) : '',
    // Caminho da foto de perfil, só do comércio verificado (aparece no Detalhe).
    fotoAnunciante: verificado ? perfil.foto || '' : '',
    origem: linha.origem === 'importado' ? 'importado' : 'colado',
    textoOrigem: TEXTO_DO_GRUPO,
    qtdAgrupados: 1,
    fotos: listaDeFotos.map((foto) => foto.url),
    listaDeFotos,
    detalhes: limparDetalhes(linha.detalhes),
  }
}

// Deixa a busca segura para o filtro do Supabase.
// O filtro "or" usa vírgula, parênteses e dois-pontos como comandos, e o ilike
// usa % e _ como curingas. Esses caracteres saem, para ninguém mudar a consulta.
// Recebe o que a pessoa digitou.
// Devolve no máximo 60 caracteres, só com o texto da busca.
export function limparTextoDaBusca(texto) {
  return String(texto || '')
    .replace(/[,()*%_\\:"'.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 60)
}

// Tira os acentos e deixa em minúsculas, igual ao que o banco faz na coluna busca_texto (migration 019).
// Assim "Fogão", "FOGÃO" e "fogao" viram todos "fogao".
// Recebe o texto da busca (já limpo por limparTextoDaBusca).
// Devolve o texto sem acento e em minúsculas.
export function tirarAcentos(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
}
