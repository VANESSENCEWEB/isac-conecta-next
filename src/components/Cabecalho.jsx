'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconeEntrar, IconeMais, IconeSair } from './Icones.jsx'
import { LINKS_DO_CABECALHO, itemAtivoDaRota } from './itensNavegacao.js'
import useSairDaConta from '@/hooks/useSairDaConta'
import { useSessaoStore } from '@/store/useSessaoStore'
import './Cabecalho.css'
import './CabecalhoNext.css'

// Selo "Perto de você · até 10 km" com o pin 3D pulando (igual ao PI).
// O pulo para quando a pessoa pede menos movimento (regra no Cabecalho.css).
// Não recebe propriedades. Devolve o link para o início.
function SeloPertoDeVoce() {
  return (
    <Link className="cabecalho__perto" href="/" aria-label="Ver anúncios perto de você, até 10 km">
      <span className="cabecalho__pino" aria-hidden="true">
        <picture>
          <source srcSet="/icones/pino-3d.webp" type="image/webp" />
          <img src="/icones/pino-3d.png" alt="" width="18" height="30" />
        </picture>
      </span>
      <span className="cabecalho__perto-texto" aria-hidden="true">
        <strong>Perto de você</strong>
        <span>até 10 km</span>
      </span>
    </Link>
  )
}

// O canto da conta, no computador. Lê do Zustand quem está logado:
//   • ainda conferindo (carregando): nada, para não piscar "Entrar" para quem já entrou;
//   • visitante: o link Entrar;
//   • quem entrou: "Olá, nome" e o botão Sair.
// Recebe o caminho aberto (para marcar o Entrar quando a tela é /entrar). Devolve o trecho.
function ContaNoCabecalho({ caminho }) {
  const conta = useSessaoStore((estado) => estado.conta)
  const carregando = useSessaoStore((estado) => estado.carregando)
  const { saindo, aoSair, erro } = useSairDaConta()

  if (carregando) {
    return null
  }

  if (!conta) {
    return (
      <Link className="cabecalho__entrar" href="/entrar" aria-current={caminho === '/entrar' ? 'page' : undefined}>
        <span className="cabecalho__entrar-icone" aria-hidden="true">
          <IconeEntrar />
        </span>
        Entrar
      </Link>
    )
  }

  // Só o primeiro nome cabe no cabeçalho ("Maria Silva" → "Maria").
  const primeiroNome = (conta.nome || '').trim().split(' ')[0]

  return (
    <div className="cabecalho__conta">
      <span className="cabecalho__ola">{primeiroNome ? `Olá, ${primeiroNome}` : 'Olá!'}</span>
      <button className="cabecalho__entrar cabecalho__sair" type="button" onClick={aoSair} disabled={saindo}>
        <span className="cabecalho__entrar-icone" aria-hidden="true">
          <IconeSair />
        </span>
        {saindo ? 'Saindo…' : 'Sair'}
      </button>
      {erro ? (
        <p className="cabecalho__erro-sair" role="alert">
          {erro}
        </p>
      ) : null}
    </div>
  )
}

// Faixa do topo, adaptada do Cabecalho.jsx do PI.
// No celular: logo e selo "Perto de você" (os links ficam na barra de baixo).
// No computador: uma pílula branca com logo, selo, links, Entrar e "+ Anunciar".
// Fica para depois: a busca (Dia 4).
// Recebe o caminho aberto (ou vazio enquanto ele não é conhecido). Devolve o cabeçalho.
function DesenhoDoCabecalho({ caminho = '' }) {
  const ativo = itemAtivoDaRota(caminho)

  return (
    <header className="cabecalho cabecalho--app">
      <Link href="/" className="cabecalho__logo" aria-label="ISAC Conecta, ir para o início">
        <img src="/logo/logo-colorida.png" alt="" width="109" height="44" />
      </Link>

      <SeloPertoDeVoce />

      <nav className="cabecalho__links" aria-label="Navegação do site">
        {LINKS_DO_CABECALHO.map((item) => {
          const ligado = ativo === item.id

          return (
            <Link
              key={item.id}
              href={item.para}
              className={ligado ? 'cabecalho__link cabecalho__link--ativo' : 'cabecalho__link'}
              aria-current={ligado ? 'page' : undefined}
            >
              {item.rotulo}
            </Link>
          )
        })}
      </nav>

      <ContaNoCabecalho caminho={caminho} />

      {/* No PI era um <button> com navigate(); aqui é um link, que o Next já pré-carrega. */}
      <Link className="cabecalho__anunciar" href="/publicar">
        <span className="cabecalho__mais" aria-hidden="true">
          <IconeMais />
        </span>
        Anunciar
      </Link>
    </header>
  )
}

// Lê o endereço aberto e desenha o cabeçalho com o link da tela atual em verde.
function CabecalhoComRota() {
  return <DesenhoDoCabecalho caminho={usePathname()} />
}

// O cabeçalho que o layout usa.
// 'use client' no topo porque o usePathname lê o endereço no navegador.
// Com cacheComponents ligado, nas rotas com [id] o endereço só é conhecido quando
// alguém abre a página, e o usePathname precisa de um <Suspense> em volta.
// O fallback é o mesmo desenho sem nenhum link verde, então nada pisca.
// Não recebe propriedades. Devolve o cabeçalho.
export default function Cabecalho() {
  return (
    <Suspense fallback={<DesenhoDoCabecalho />}>
      <CabecalhoComRota />
    </Suspense>
  )
}
