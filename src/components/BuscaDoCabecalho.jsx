'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconeBusca } from './Icones.jsx'
import { useDigitacao } from '@/hooks/useDigitacao'
import { usePrefereMenosMovimento } from '@/hooks/usePrefereMenosMovimento'
import { useFiltrosStore } from '@/store/useFiltrosStore'
import { PALAVRAS_DA_BUSCA } from '@/utils/digitacao'
import './BuscaAnimada.css'

// Os nomes das classes de cada desenho, iguais aos do PI:
//   • celular: a pílula de borda dourada (BuscaAnimada.css), na segunda linha do cabeçalho;
//   • computador: a pílula dentro do cabeçalho (Cabecalho.css).
const CLASSES = {
  celular: {
    form: 'busca-animada',
    campo: 'busca-animada__campo',
    icone: 'busca-animada__icone',
    rotulo: 'busca-animada__rotulo',
    dica: 'busca-animada__dica',
  },
  computador: {
    form: 'cabecalho__busca',
    campo: 'cabecalho__campo',
    icone: 'cabecalho__icone-busca',
    rotulo: 'cabecalho__rotulo',
    dica: 'cabecalho__dica',
  },
}

// A dica "Buscar produtos / imóveis / serviços / vagas" sendo digitada por cima do campo vazio.
// Recebe a palavra da vez (do useDigitacao), se a pessoa pediu menos movimento (parado) e a classe.
// Devolve o texto da dica, escondido do leitor de tela (o campo já tem o rótulo "Buscar no bairro").
function DicaDaBusca({ palavra, parado, className }) {
  return (
    <span className={className} aria-hidden="true">
      Buscar{' '}
      {parado ? (
        <strong>{PALAVRAS_DA_BUSCA.slice(0, 3).join(', ')}…</strong>
      ) : (
        <>
          <strong>{palavra}</strong>
          <span className="busca-animada__cursor" />
        </>
      )}
    </span>
  )
}

// A busca do cabeçalho, adaptada do BuscaAnimada.jsx e do BuscaDoCabecalho do PI.
//   • enquanto está vazia e sem foco, a dica "Buscar produtos", "Buscar imóveis"… vai sendo digitada;
//   • quem pediu menos movimento vê a dica parada: "Buscar produtos, imóveis, serviços…";
//   • o texto vai direto para o Zustand (useFiltrosStore), e a Vitrine lê de lá.
//     Por isso as duas buscas (a do celular e a do computador) mostram sempre o mesmo texto;
//   • fora da página inicial, a primeira letra leva para a vitrine, onde estão os resultados.
//     O cabeçalho fica no layout, então trocar de página não tira o foco do campo.
// Ficou de fora o botão de Filtros: a folha de filtros do PI não veio para o projeto final.
// Recebe a variante ("celular" ou "computador") e o caminho aberto, que vem do cabeçalho
// (lá o usePathname já está dentro do <Suspense>). Devolve o formulário de busca.
export default function BuscaDoCabecalho({ variante, caminho }) {
  const classes = CLASSES[variante]
  const busca = useFiltrosStore((estado) => estado.busca)
  const mudarBusca = useFiltrosStore((estado) => estado.mudarBusca)
  const router = useRouter()
  const [focado, setFocado] = useState(false)
  const parado = usePrefereMenosMovimento()
  const mostrarDica = !busca && !focado
  const palavra = useDigitacao(mostrarDica && !parado)

  // Guarda o que a pessoa digitou e, se ela não está na vitrine, leva até lá.
  // Recebe o texto. Não devolve valor.
  function aoDigitar(texto) {
    mudarBusca(texto)
    if (caminho && caminho !== '/') {
      router.push('/')
    }
  }

  // Enter: a vitrine já filtra enquanto a pessoa digita; aqui só garante que ela está na vitrine.
  // Recebe o evento de envio. Não devolve valor.
  function aoEnviar(evento) {
    evento.preventDefault()
    if (caminho && caminho !== '/') {
      router.push('/')
    }
  }

  return (
    <form className={`${classes.form} busca-cabecalho`} role="search" onSubmit={aoEnviar}>
      <label className={classes.campo}>
        <span className={classes.icone} aria-hidden="true">
          <IconeBusca />
        </span>
        <span className={classes.rotulo}>Buscar no bairro</span>
        <input
          type="search"
          value={busca}
          maxLength={80}
          enterKeyHint="search"
          autoComplete="off"
          onChange={(evento) => aoDigitar(evento.target.value)}
          onFocus={() => setFocado(true)}
          onBlur={() => setFocado(false)}
        />
        {mostrarDica ? <DicaDaBusca palavra={palavra} parado={parado} className={classes.dica} /> : null}
      </label>
    </form>
  )
}
