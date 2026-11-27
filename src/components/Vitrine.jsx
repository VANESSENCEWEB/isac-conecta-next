'use client'

import { useEffect, useState } from 'react'
import CardAnuncio from './CardAnuncio.jsx'
import FaixaCategorias from './FaixaCategorias.jsx'
import { IconeBusca } from './Icones.jsx'
import { buscarCategoria } from '@/dados/categorias'
import { useAnuncios } from '@/hooks/useAnuncios'
import { useFavoritos } from '@/hooks/useFavoritos'
import { useFiltrosStore } from '@/store/useFiltrosStore'
import './Vitrine.css'

// =============================================================================
// VITRINE (página inicial)
// Junta as duas bibliotecas do projeto:
//   • Zustand (useFiltrosStore) guarda a busca e a categoria escolhida. Por ser global,
//     abrir um anúncio e voltar mantém o filtro;
//   • TanStack Query (useAnuncios) traz do Supabase os anúncios desses filtros.
// No PI a Vitrine.jsx tinha 650 linhas (carrossel, bairro, ordem, paginação);
// aqui ficou o essencial: busca, categorias e a lista.
// =============================================================================

// Espera um pouco depois da última tecla antes de buscar, para não consultar
// o banco a cada letra digitada.
const ESPERA_DA_BUSCA = 350

// Campo de busca. O texto digitado fica num estado local e vai para o Zustand
// depois da pausa; assim a vitrine busca só quando a pessoa para de digitar.
// Não recebe propriedades. Devolve o formulário de busca.
function CampoDeBusca() {
  const buscaGuardada = useFiltrosStore((estado) => estado.busca)
  const mudarBusca = useFiltrosStore((estado) => estado.mudarBusca)
  const [texto, setTexto] = useState(buscaGuardada)

  useEffect(() => {
    const relogio = setTimeout(() => mudarBusca(texto.trim()), ESPERA_DA_BUSCA)
    return () => clearTimeout(relogio)
  }, [texto, mudarBusca])

  return (
    <form className="vitrine__busca" role="search" onSubmit={(evento) => evento.preventDefault()}>
      <IconeBusca />
      <label className="visualmente-escondido" htmlFor="busca-vitrine">
        Buscar no bairro
      </label>
      <input
        id="busca-vitrine"
        type="search"
        placeholder="Buscar fogão, diarista, kitnet…"
        value={texto}
        onChange={(evento) => setTexto(evento.target.value)}
        maxLength={60}
        autoComplete="off"
      />
    </form>
  )
}

// Frase em cima da lista: quantos anúncios e com qual filtro.
// Recebe a quantidade, a categoria (slug) e a busca.
// Devolve o texto, por exemplo "3 anúncios em Imóveis para “kitnet”".
function resumoDaLista(quantidade, categoria, busca) {
  const plural = quantidade === 1 ? 'anúncio' : 'anúncios'
  let texto = `${quantidade} ${plural}`

  if (categoria !== 'todos') {
    texto += ` em ${buscarCategoria(categoria).nome}`
  }

  if (busca) {
    texto += ` para “${busca}”`
  }

  return texto
}

// A página inicial inteira. Não recebe propriedades. Devolve o <main>.
export default function Vitrine() {
  const busca = useFiltrosStore((estado) => estado.busca)
  const categoria = useFiltrosStore((estado) => estado.categoria)
  const limparFiltros = useFiltrosStore((estado) => estado.limparFiltros)
  const { data: anuncios, isPending, isError, error, refetch, isFetching } = useAnuncios({ busca, categoria })
  const { estaFavorito, alternarFavorito } = useFavoritos()
  const temFiltro = busca !== '' || categoria !== 'todos'

  return (
    <main className="vitrine">
      <section className="vitrine__topo">
        <p className="vitrine__olho">ISAC CONECTA</p>
        <h1 className="vitrine__titulo">A vitrine do bairro</h1>
        <p className="vitrine__texto">Produtos, serviços, vagas, imóveis e eventos do Cabo, conferidos pelo ISAC.</p>
        <CampoDeBusca />
      </section>

      <FaixaCategorias />

      <section className="vitrine__lista" aria-labelledby="titulo-lista" aria-busy={isFetching}>
        <h2 id="titulo-lista" className="vitrine__subtitulo">
          Anúncios do bairro
        </h2>

        {isPending ? <p className="vitrine__aviso">Carregando anúncios…</p> : null}

        {isError ? (
          <div className="vitrine__aviso" role="alert">
            <p>{error.message}</p>
            <button className="vitrine__botao-texto" type="button" onClick={() => refetch()}>
              Tentar de novo
            </button>
          </div>
        ) : null}

        {anuncios ? (
          <>
            <p className="vitrine__resumo" aria-live="polite">
              {resumoDaLista(anuncios.length, categoria, busca)}
            </p>

            {anuncios.length === 0 ? (
              <div className="vitrine__vazio">
                <p>Nada encontrado com esse filtro.</p>
                {temFiltro ? (
                  <button className="vitrine__botao-texto" type="button" onClick={limparFiltros}>
                    Limpar filtros
                  </button>
                ) : null}
              </div>
            ) : (
              <ul className="vitrine__grade">
                {anuncios.map((anuncio) => (
                  <li key={anuncio.id}>
                    <CardAnuncio anuncio={anuncio} favorito={estaFavorito(anuncio.id)} onFavoritar={alternarFavorito} />
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : null}
      </section>
    </main>
  )
}
