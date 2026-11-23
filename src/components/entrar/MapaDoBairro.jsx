'use client'

import { useEffect, useState } from 'react'
import { usePrefereMenosMovimento } from '@/hooks/usePrefereMenosMovimento'
import './MapaDoBairro.css'

// =============================================================================
// MAPA DO BAIRRO (animação da tela Entrar, só no computador)
// No meio aparece uma mensagem solta do grupo de WhatsApp. Em seguida ela "vira"
// um anúncio organizado (categoria, título, bairro e preço) e ganha um ✓ amarelo:
// é a ideia do app, a IA transformando o grupo em classificados.
// Em volta ficam as 6 categorias, ligadas ao meio por linhas tracejadas.
// É só enfeite: fica escondida do leitor de tela (aria-hidden).
// As mensagens são INVENTADAS e os telefones aparecem cortados.
// =============================================================================

// Cada categoria: posição no quadro (em %) e nome. O ícone vem de /public/icones.
const CATEGORIAS = [
  { slug: 'produtos', nome: 'Produtos', x: 24, y: 17 },
  { slug: 'servicos', nome: 'Serviços', x: 72, y: 14 },
  { slug: 'imoveis', nome: 'Imóveis', x: 86, y: 45 },
  { slug: 'eventos', nome: 'Eventos', x: 76, y: 78 },
  { slug: 'comunitario', nome: 'Comunitário', x: 30, y: 88 },
  { slug: 'vagas', nome: 'Vagas', x: 14, y: 55 },
]

// Exemplos (inventados): a mensagem como chega no grupo e o anúncio que a IA monta.
const EXEMPLOS = [
  {
    categoria: 'produtos',
    mensagem: ['vendo fogão 4 bocas', '250 zap 81 9 9900-•••••'],
    anuncio: { rotulo: 'Produtos', titulo: 'Fogão 4 bocas', bairro: 'Vila Social', preco: 'R$ 250' },
  },
  {
    categoria: 'servicos',
    mensagem: ['faço unha em casa', 'chama no 81 9 9812-•••••'],
    anuncio: { rotulo: 'Serviços', titulo: 'Manicure em casa', bairro: 'Centro', preco: 'A combinar' },
  },
  {
    categoria: 'imoveis',
    mensagem: ['alugo casa 2 quartos', '600 no Garapu'],
    anuncio: { rotulo: 'Imóveis', titulo: 'Casa com 2 quartos', bairro: 'Garapu', preco: 'R$ 600/mês' },
  },
  {
    categoria: 'vagas',
    mensagem: ['precisa ajudante de pedreiro', 'diária 120'],
    anuncio: { rotulo: 'Vagas', titulo: 'Ajudante de pedreiro', bairro: 'Ponte dos Carvalhos', preco: 'R$ 120/dia' },
  },
]

// Quanto tempo cada fase fica na tela (em milissegundos).
const TEMPO = { mensagem: 2000, anuncio: 3000 }

// Controla o ciclo: mensagem do grupo → anúncio organizado → próximo exemplo.
// Não recebe argumentos.
// Devolve { indice, fase }. Quem prefere menos movimento vê o primeiro anúncio, parado.
function useCicloDaIA() {
  // No PI isto era lido direto no desenho (prefereMenosMovimento). No Next a página também
  // é montada no servidor, onde não existe "window"; o hook cuida disso.
  const parado = usePrefereMenosMovimento()

  const [passo, setPasso] = useState({ indice: 0, fase: 'mensagem' })

  useEffect(() => {
    if (parado) {
      return undefined
    }

    // Espera o tempo da fase atual e passa para a próxima.
    const espera = setTimeout(() => {
      setPasso((atual) =>
        atual.fase === 'mensagem'
          ? { indice: atual.indice, fase: 'anuncio' }
          : { indice: (atual.indice + 1) % EXEMPLOS.length, fase: 'mensagem' },
      )
    }, TEMPO[passo.fase])

    // Ao sair da tela, cancela a espera.
    return () => clearTimeout(espera)
  }, [passo, parado])

  return parado ? { indice: 0, fase: 'anuncio' } : passo
}

// Balão verde com a mensagem do jeito que chega no grupo.
// Recebe as linhas da mensagem.
function BalaoDoGrupo({ linhas }) {
  return (
    <div className="mapa-bairro__balao">
      <p className="mapa-bairro__grupo">Grupo do bairro</p>
      {linhas.map((linha) => (
        <p key={linha}>{linha}</p>
      ))}
    </div>
  )
}

// Cartão do anúncio já organizado pela IA, com o ✓ amarelo.
// Recebe { rotulo, titulo, bairro, preco }.
function CartaoOrganizado({ anuncio }) {
  return (
    <div className="mapa-bairro__cartao">
      <span className="mapa-bairro__check">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="mapa-bairro__rotulo">{anuncio.rotulo}</span>
      <p className="mapa-bairro__titulo">{anuncio.titulo}</p>
      <p className="mapa-bairro__bairro">{anuncio.bairro}</p>
      <p className="mapa-bairro__preco">{anuncio.preco}</p>
    </div>
  )
}

// Quadro verde com a animação.
// Não recebe propriedades.
// Devolve o quadro.
export default function MapaDoBairro() {
  const { indice, fase } = useCicloDaIA()
  const exemplo = EXEMPLOS[indice]

  return (
    <div className="mapa-bairro" aria-hidden="true">
      {/* Linhas tracejadas do meio até cada categoria (desenho em SVG). */}
      <svg className="mapa-bairro__linhas" viewBox="0 0 100 100" preserveAspectRatio="none">
        {CATEGORIAS.map((categoria) => (
          <line
            key={categoria.slug}
            x1="50"
            y1="50"
            x2={categoria.x}
            y2={categoria.y}
            className={
              fase === 'anuncio' && categoria.slug === exemplo.categoria
                ? 'mapa-bairro__linha mapa-bairro__linha--ativa'
                : 'mapa-bairro__linha'
            }
          />
        ))}
      </svg>

      {/* Bolinhas das categorias, cada uma flutuando no seu ritmo. */}
      {CATEGORIAS.map((categoria, posicao) => (
        <div
          key={categoria.slug}
          className="mapa-bairro__categoria"
          style={{ left: `${categoria.x}%`, top: `${categoria.y}%`, '--atraso': `${posicao * 0.35}s` }}
        >
          <div className="mapa-bairro__bolinha">
            {/* "lazy": no celular o quadro fica escondido e as imagens nem baixam. */}
            <img src={`/icones/${categoria.slug}.png`} alt="" width="60" height="60" loading="lazy" />
            <span>{categoria.nome}</span>
          </div>
        </div>
      ))}

      {/* O meio: a "key" muda a cada fase, então a animação de entrada roda de novo. */}
      <div className="mapa-bairro__meio" key={`${indice}-${fase}`}>
        {fase === 'mensagem' ? <BalaoDoGrupo linhas={exemplo.mensagem} /> : <CartaoOrganizado anuncio={exemplo.anuncio} />}
      </div>
    </div>
  )
}
