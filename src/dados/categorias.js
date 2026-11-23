// As seis categorias fixas da vitrine, mais "Todos".
// A cor do círculo e a cor do selo vêm daqui, para o card e o filtro usarem a mesma.
export const categorias = [
  {
    id: 'todos',
    nome: 'Todos',
    selo: '',
    icone: '/icones/todos.png',
    circulo: 'todos',
  },
  {
    id: 'produtos',
    nome: 'Produtos',
    selo: 'PRODUTO',
    icone: '/icones/produtos.png',
    circulo: 'produtos',
  },
  {
    id: 'servicos',
    nome: 'Serviços',
    selo: 'SERVIÇO',
    icone: '/icones/servicos.png',
    circulo: 'servicos',
  },
  {
    id: 'imoveis',
    nome: 'Imóveis',
    selo: 'IMÓVEL',
    icone: '/icones/imoveis.png',
    circulo: 'imoveis',
  },
  {
    id: 'vagas',
    nome: 'Vagas',
    selo: 'VAGA',
    icone: '/icones/vagas.png',
    circulo: 'vagas',
  },
  {
    id: 'eventos',
    nome: 'Eventos',
    selo: 'EVENTO',
    icone: '/icones/eventos.png',
    circulo: 'eventos',
  },
  {
    id: 'comunitario',
    nome: 'Comunitário',
    selo: 'COMUNITÁRIO',
    icone: '/icones/comunitario.png',
    circulo: 'comunitario',
  },
]

// Procura uma categoria pelo id (produtos, servicos...).
// Recebe o id.
// Devolve a categoria, ou "Todos" se o id não existir.
export function buscarCategoria(id) {
  return categorias.find((categoria) => categoria.id === id) || categorias[0]
}
