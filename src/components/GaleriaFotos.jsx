'use client'

import { useRef, useState } from 'react'
import { IconeSeta } from './Icones.jsx'
import './GaleriaFotos.css'

// Distância mínima (em pixels) do arrasto do dedo para trocar de foto
const ARRASTO_MINIMO = 40

// Veio do GaleriaFotos.jsx do PI sem mudança no funcionamento (só o 'use client' do Next).
// Galeria de fotos de um anúncio: uma foto grande por vez, setas para os lados,
// contador "2 / 4", arrastar com o dedo no celular e (opcional) as miniaturas embaixo.
// Recebe:
//   fotos: lista de endereços das imagens;
//   titulo: texto para descrever as fotos para o leitor de tela;
//   miniaturas: true mostra a tira de miniaturas (para ver todas de uma vez);
//   aoAbrir: função opcional chamada ao tocar na foto grande (recebe o endereço).
// Devolve a galeria. Com uma foto só, não mostra setas nem contador.
export default function GaleriaFotos({ fotos, titulo = 'do anúncio', miniaturas = false, aoAbrir }) {
  const [atual, setAtual] = useState(0)
  const inicioDoToque = useRef(null)
  const total = fotos.length
  const varias = total > 1

  // Vai para a foto anterior ou a próxima, voltando ao começo no fim (e vice-versa).
  // Recebe -1 (anterior) ou 1 (próxima).
  // Não devolve valor.
  function andar(passo) {
    setAtual((posicao) => (posicao + passo + total) % total)
  }

  // Guarda onde o dedo encostou.
  function aoTocar(evento) {
    inicioDoToque.current = evento.touches[0].clientX
  }

  // Quando o dedo sai, vê se foi um arrasto para o lado e troca a foto.
  function aoSoltar(evento) {
    if (inicioDoToque.current === null) {
      return
    }

    const distancia = evento.changedTouches[0].clientX - inicioDoToque.current
    inicioDoToque.current = null

    if (Math.abs(distancia) >= ARRASTO_MINIMO) {
      andar(distancia < 0 ? 1 : -1)
    }
  }

  // Setas do teclado trocam a foto quando o foco está na galeria.
  function aoTeclar(evento) {
    if (evento.key === 'ArrowLeft') {
      andar(-1)
    } else if (evento.key === 'ArrowRight') {
      andar(1)
    }
  }

  if (!total) {
    return null
  }

  return (
    <div
      className="galeria-fotos"
      role="group"
      aria-roledescription="carrossel"
      aria-label={`Fotos ${titulo}`}
      onKeyDown={varias ? aoTeclar : undefined}
    >
      <div className="galeria-fotos__palco" onTouchStart={varias ? aoTocar : undefined} onTouchEnd={varias ? aoSoltar : undefined}>
        {/* eslint-disable-next-line @next/next/no-img-element -- a foto vem do Storage do Supabase, de qualquer tamanho */}
        <img
          src={fotos[atual]}
          alt={`Foto ${atual + 1} de ${total} ${titulo}`}
          onClick={aoAbrir ? () => aoAbrir(fotos[atual]) : undefined}
          className={aoAbrir ? 'galeria-fotos__foto galeria-fotos__foto--abre' : 'galeria-fotos__foto'}
        />

        {varias ? (
          <>
            <button type="button" className="galeria-fotos__seta galeria-fotos__seta--esquerda" aria-label="Foto anterior" onClick={() => andar(-1)}>
              <IconeSeta direcao="esquerda" />
            </button>
            <button type="button" className="galeria-fotos__seta galeria-fotos__seta--direita" aria-label="Próxima foto" onClick={() => andar(1)}>
              <IconeSeta direcao="direita" />
            </button>
            <span className="galeria-fotos__contador" aria-live="polite">{atual + 1} / {total}</span>
          </>
        ) : null}
      </div>

      {varias && miniaturas ? (
        <ul className="galeria-fotos__tira">
          {fotos.map((url, posicao) => (
            <li key={url}>
              <button
                type="button"
                className={posicao === atual ? 'galeria-fotos__miniatura galeria-fotos__miniatura--atual' : 'galeria-fotos__miniatura'}
                aria-label={`Ver a foto ${posicao + 1}`}
                aria-current={posicao === atual ? 'true' : undefined}
                onClick={() => setAtual(posicao)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- miniatura da mesma foto */}
                <img src={url} alt="" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
