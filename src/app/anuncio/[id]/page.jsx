import { Suspense } from 'react'
import TelaEmConstrucao from '@/components/TelaEmConstrucao'

export const metadata = { title: 'Anúncio · ISAC Conecta' }

// [id] na pasta é uma rota dinâmica: /anuncio/7 chega aqui com params.id = "7".
// Nesta versão do Next (cacheComponents ligado no next.config.mjs), o id só é conhecido
// quando alguém abre a página. Por isso quem lê o params fica dentro de um <Suspense>:
// o Next monta o resto da página no build e mostra o fallback até o id chegar.
export default function PaginaAnuncio({ params }) {
  return (
    <Suspense fallback={<TelaEmConstrucao titulo="Anúncio" dia="Dia 4" />}>
      <ConteudoDoAnuncio params={params} />
    </Suspense>
  )
}

// Recebe o params (uma Promise) e devolve a tela com o número do anúncio.
async function ConteudoDoAnuncio({ params }) {
  const { id } = await params

  return <TelaEmConstrucao titulo={`Anúncio ${id}`} dia="Dia 4" />
}
