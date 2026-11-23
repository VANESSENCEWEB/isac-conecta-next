// =============================================================================
// TEXTOS DA TELA ENTRAR
// O título muda conforme o motivo de a pessoa estar entrando (o ?voltar= do link):
// quem veio de um convite do grupo, quem quer publicar, quem tem comércio...
// O título tem uma parte em destaque (cor diferente), por isso vem em 3 pedaços.
// =============================================================================

// Textos de cada motivo. "comeca" é o começo do caminho de volta.
const TEXTOS = [
  {
    comeca: '/convite/',
    olho: 'SEU ANÚNCIO DO GRUPO',
    antes: 'Entre para ver o anúncio que ',
    destaque: 'trouxemos do grupo',
    depois: '.',
    resumo: 'Confira os dados e coloque na vitrine do bairro com um toque.',
  },
  {
    comeca: '/publicar',
    olho: 'PUBLICAR NO BAIRRO',
    antes: 'Entre para ',
    destaque: 'publicar seu anúncio',
    depois: '.',
    resumo: 'Cole a mensagem do grupo e a IA organiza o anúncio para você.',
  },
  {
    comeca: '/negocio',
    olho: 'SEU COMÉRCIO',
    antes: 'Entre e faça seu ',
    destaque: 'comércio aparecer',
    depois: ' no bairro.',
    resumo: 'Acompanhe seus anúncios, o selo de verificado e os destaques.',
  },
]

// Texto padrão: quem abriu o Entrar direto.
const PADRAO = {
  olho: 'BEM-VINDO DE VOLTA',
  antes: 'Do grupo do bairro à ',
  destaque: 'economia organizada',
  depois: '.',
  resumo: 'Entre para ver seus anúncios e publicar para a vizinhança.',
}

// Escolhe os textos da tela Entrar.
// Recebe o caminho de volta (já conferido por destinoSeguro), ex.: "/convite/abc".
// Devolve { olho, antes, destaque, depois, resumo }.
export function textosDoEntrar(voltar) {
  const caminho = String(voltar || '')
  const achado = TEXTOS.find((texto) => caminho.startsWith(texto.comeca))

  if (!achado) {
    return PADRAO
  }

  // Tira o "comeca", que só serve para a busca.
  const { comeca: _comeca, ...textos } = achado
  return textos
}
