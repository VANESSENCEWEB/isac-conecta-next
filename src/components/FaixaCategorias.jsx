'use client'

import Categoria from './Categoria.jsx'
import { buscarCategoria } from '@/dados/categorias'
import { useCategorias } from '@/hooks/useCategorias'
import { useFiltrosStore } from '@/store/useFiltrosStore'
import './FaixaCategorias.css'

// Faixa de categorias da vitrine. Junta as duas bibliotecas do projeto:
//   • TanStack Query (useCategorias) traz as categorias do Supabase;
//   • Zustand (useFiltrosStore) guarda qual delas está escolhida.
// O ícone e a cor de cada uma vêm de src/dados/categorias.js (pelo slug).
// Não recebe propriedades. Devolve a faixa, o aviso de carregando ou o erro.
export default function FaixaCategorias() {
  const { data: categorias, isPending, isError, error, refetch } = useCategorias()
  const escolhida = useFiltrosStore((estado) => estado.categoria)
  const escolherCategoria = useFiltrosStore((estado) => estado.escolherCategoria)

  if (isPending) {
    return <p className="faixa-categorias__aviso">Carregando categorias…</p>
  }

  if (isError) {
    return (
      <div className="faixa-categorias__aviso" role="alert">
        <p>{error.message}</p>
        <button type="button" onClick={() => refetch()}>
          Tentar de novo
        </button>
      </div>
    )
  }

  // "Todos" vem primeiro e não está no banco: é só o filtro desligado.
  const todas = [{ slug: 'todos', nome: 'Todos' }, ...categorias]

  return (
    <section>
      <div className="faixa-categorias" role="tablist" aria-label="Categorias">
        {todas.map((categoria) => {
          const visual = buscarCategoria(categoria.slug)

          return (
            <Categoria
              key={categoria.slug}
              nome={categoria.nome}
              icone={visual.icone}
              circulo={visual.circulo}
              ativa={escolhida === categoria.slug}
              onClick={() => escolherCategoria(categoria.slug)}
            />
          )
        })}
      </div>
      <p className="faixa-categorias__escolhida">
        Filtro escolhido (guardado no Zustand): <strong>{escolhida}</strong>
      </p>
    </section>
  )
}
