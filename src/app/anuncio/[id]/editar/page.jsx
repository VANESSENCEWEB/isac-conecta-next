import { Suspense } from 'react'
import TelaEmConstrucao from '@/components/TelaEmConstrucao'

export const metadata = { title: 'Editar anúncio · ISAC Conecta' }

// Mesma ideia do /anuncio/[id]: o params só é lido dentro do <Suspense>.
export default function PaginaEditarAnuncio({ params }) {
  return (
    <Suspense fallback={<TelaEmConstrucao titulo="Editar anúncio" dia="Dia 5" />}>
      <ConteudoEditar params={params} />
    </Suspense>
  )
}

async function ConteudoEditar({ params }) {
  const { id } = await params

  return <TelaEmConstrucao titulo={`Editar anúncio ${id}`} dia="Dia 5" />
}
