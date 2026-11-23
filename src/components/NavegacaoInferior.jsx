'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconeMais } from './Icones.jsx'
import { ITENS_DA_BARRA, itemAtivoDaRota } from './itensNavegacao.js'
import './NavegacaoInferior.css'

// Barra de baixo, só no celular (no computador os mesmos links ficam no cabeçalho).
// Igual ao PI: 5 itens com ícone e nome, e o "+" terracota sempre no centro.
// O item da tela aberta fica verde.
// Recebe o caminho aberto (ou vazio enquanto ele não é conhecido). Devolve a barra.
function DesenhoDaBarra({ caminho = '' }) {
  const ativo = itemAtivoDaRota(caminho)

  return (
    <nav className="nav-inferior" aria-label="Navegação principal">
      {ITENS_DA_BARRA.map((item) => {
        if (item.publicar) {
          return (
            <Link key={item.id} className="nav-inferior__publicar" href={item.para} aria-label="Publicar anúncio">
              <span className="nav-inferior__circulo" aria-hidden="true">
                <IconeMais />
              </span>
              <span className="nav-inferior__nome" aria-hidden="true">
                {item.rotulo}
              </span>
            </Link>
          )
        }

        const ligado = ativo === item.id
        const Icone = item.Icone

        return (
          <Link
            key={item.id}
            className={ligado ? 'nav-inferior__item nav-inferior__item--ativo' : 'nav-inferior__item'}
            href={item.para}
            aria-current={ligado ? 'page' : undefined}
          >
            <Icone />
            <span className="nav-inferior__nome">{item.rotulo}</span>
          </Link>
        )
      })}
    </nav>
  )
}

function BarraComRota() {
  return <DesenhoDaBarra caminho={usePathname()} />
}

// A barra que o layout usa. Mesmo motivo do <Suspense> do Cabecalho.jsx:
// nas rotas com [id], o usePathname espera o endereço chegar.
// Não recebe propriedades. Devolve a barra.
export default function NavegacaoInferior() {
  return (
    <Suspense fallback={<DesenhoDaBarra />}>
      <BarraComRota />
    </Suspense>
  )
}
