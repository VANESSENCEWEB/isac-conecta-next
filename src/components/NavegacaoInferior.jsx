'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconeConta, IconeMais, IconeSair } from './Icones.jsx'
import { ITENS_DA_BARRA, itemAtivoDaRota } from './itensNavegacao.js'
import useSairDaConta from '@/hooks/useSairDaConta'
import { useSessaoStore } from '@/store/useSessaoStore'
import './NavegacaoInferior.css'
import './NavegacaoInferiorNext.css'

// Item da conta na barra (lê do Zustand quem está logado).
// Visitante, ou ainda conferindo: o link Entrar. Quem entrou: o botão Sair.
// Recebe se a tela aberta é a de Entrar. Devolve o item.
function ItemDaConta({ ligado }) {
  const conta = useSessaoStore((estado) => estado.conta)
  const { saindo, aoSair } = useSairDaConta()

  if (conta) {
    return (
      <button className="nav-inferior__item nav-inferior__sair" type="button" onClick={aoSair} disabled={saindo}>
        <IconeSair />
        <span className="nav-inferior__nome">{saindo ? 'Saindo…' : 'Sair'}</span>
      </button>
    )
  }

  return (
    <Link
      className={ligado ? 'nav-inferior__item nav-inferior__item--ativo' : 'nav-inferior__item'}
      href="/entrar"
      aria-current={ligado ? 'page' : undefined}
    >
      <IconeConta />
      <span className="nav-inferior__nome">Entrar</span>
    </Link>
  )
}

// Barra de baixo, só no celular (no computador os mesmos links ficam no cabeçalho).
// Igual ao PI: 5 itens com ícone e nome, e o "+" terracota sempre no centro.
// O item da tela aberta fica verde.
// Recebe o caminho aberto (ou vazio enquanto ele não é conhecido). Devolve a barra.
// Fica abaixo do ItemDaConta, que troca Entrar por Sair.
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

        // O último item é da conta: "Entrar" para o visitante, "Sair" para quem entrou.
        if (item.id === 'entrar') {
          return <ItemDaConta key={item.id} ligado={ativo === item.id} />
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
