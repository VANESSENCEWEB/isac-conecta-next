import Link from 'next/link'
import { buscarCategoria } from '@/dados/categorias'
import { formatarPreco } from '@/utils/formatarPreco'
import { formatarQuando } from '@/utils/formatarQuando'
import { IconeCoracao, IconePino, IconeVerificado } from './Icones.jsx'
import './CardAnuncio.css'

// =============================================================================
// CARD DE UM ANÚNCIO NA VITRINE
// Veio do CardAnuncio.jsx do PI. Mudou: o <Link> agora é o do next/link (href no
// lugar de to). O coração só aparece quando quem usa o card passa onFavoritar.
// =============================================================================

// Recebe o anúncio (já no formato do converterAnuncio), se o coração está marcado
// e a função do coração (opcional).
// Devolve o card. O clique no card abre o detalhe (/anuncio/<id>); o coração não abre.
export default function CardAnuncio({ anuncio, favorito = false, onFavoritar }) {
  const categoria = buscarCategoria(anuncio.categoria)
  const preco = formatarPreco(anuncio)
  const foto = anuncio.fotos[0]

  return (
    <article className="card-anuncio">
      <Link className="card-anuncio__link" href={`/anuncio/${anuncio.id}`}>
        {foto ? (
          // eslint-disable-next-line @next/next/no-img-element -- a foto vem do Storage do Supabase, de qualquer tamanho
          <img className="card-anuncio__foto" src={foto} alt="" />
        ) : (
          <span className={`card-anuncio__foto card-anuncio__foto--${categoria.circulo}`} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element -- ícone pequeno da categoria */}
            <img src={categoria.icone} alt="" width="48" height="48" />
          </span>
        )}
        <span className="card-anuncio__info">
          <span className="card-anuncio__topo">
            <span className={`card-anuncio__selo card-anuncio__selo--${categoria.circulo}`}>{categoria.selo}</span>
            {anuncio.verificado ? (
              <span className="card-anuncio__verificado">
                <IconeVerificado />
                Verificado
              </span>
            ) : null}
          </span>
          <span className="card-anuncio__titulo">{anuncio.titulo}</span>
          <span className="card-anuncio__preco">
            {preco.principal}
            {preco.sufixo ? <span className="card-anuncio__sufixo">{preco.sufixo}</span> : null}
          </span>
          <span className="card-anuncio__local">
            <IconePino />
            <span>
              {anuncio.bairro} · {formatarQuando(anuncio.horasAtras)}
            </span>
          </span>
        </span>
      </Link>
      {onFavoritar ? (
        <button
          className={favorito ? 'card-anuncio__favorito card-anuncio__favorito--marcado' : 'card-anuncio__favorito'}
          type="button"
          aria-pressed={favorito}
          aria-label={favorito ? 'Remover dos salvos' : 'Salvar anúncio'}
          onClick={() => onFavoritar(anuncio.id)}
        >
          <IconeCoracao preenchido={favorito} />
        </button>
      ) : null}
    </article>
  )
}
