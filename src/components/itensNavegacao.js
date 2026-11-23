import { IconeCasa, IconeConta, IconeEstrela, IconeLista } from './Icones.jsx'

// Lista única dos links do site, usada pelo cabeçalho (computador) e pela barra de baixo (celular).
// Veio do itensNavegacao.js do PI, só com as telas deste projeto.
// Por enquanto é a mesma para todo mundo; no Dia 3, com a sessão no Zustand,
// "Entrar" vira o perfil de quem entrou.

// Barra de baixo do celular: 5 itens, com o "+ Anunciar" sempre no meio.
export const ITENS_DA_BARRA = [
  { id: 'inicio', rotulo: 'Início', para: '/', Icone: IconeCasa },
  { id: 'destaques', rotulo: 'Destaques', para: '/destaques', Icone: IconeEstrela },
  { id: 'publicar', publicar: true, rotulo: 'Anunciar', para: '/publicar' },
  { id: 'anuncios', rotulo: 'Anúncios', para: '/meus-anuncios', Icone: IconeLista },
  { id: 'entrar', rotulo: 'Entrar', para: '/entrar', Icone: IconeConta },
]

// Links do cabeçalho no computador (lá não existe a barra de baixo).
// "Entrar" e "Anunciar" são botões à parte.
export const LINKS_DO_CABECALHO = [
  { id: 'destaques', rotulo: 'Destaques', para: '/destaques' },
  { id: 'categorias', rotulo: 'Categorias', para: '/categorias' },
  { id: 'anuncios', rotulo: 'Meus anúncios', para: '/meus-anuncios' },
]

// Descobre qual item corresponde à tela aberta, para pintar de verde.
// Recebe o caminho da página (ex.: "/meus-anuncios"), ou vazio enquanto ele não é conhecido.
// Devolve o id do item, ou null se nenhum combinar.
export function itemAtivoDaRota(caminho) {
  if (!caminho) {
    return null
  }

  if (caminho === '/') {
    return 'inicio'
  }

  const todos = [...ITENS_DA_BARRA, ...LINKS_DO_CABECALHO]
  const item = todos.find((cada) => cada.para !== '/' && caminho.startsWith(cada.para))

  return item ? item.id : null
}
