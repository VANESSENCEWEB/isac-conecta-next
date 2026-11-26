'use client'

import { useEffect, useState } from 'react'
import { usePrefereMenosMovimento } from '@/hooks/usePrefereMenosMovimento'
import { IconeCadeado, IconeEscudo, IconePessoa, IconeVerificado } from './Icones.jsx'
import './PainelRecuperacao.css'

// =============================================================================
// PAINEL "SUA CONTA DE VOLTA EM 3 PASSOS" (Esqueci minha senha, só no computador)
// Mesmo visual do PainelConta (painel verde com círculos), com um motion simples:
// um mini formulário se preenche sozinho, um passo de cada vez, e o passo da lista
// que está acontecendo acende. No fim, a senha é trocada e chega o código novo.
// Depois de uma pausa, recomeça.
// Quem pediu menos movimento vê o mini formulário já preenchido, parado.
// O mini formulário é só ilustração (aria-hidden): o leitor de tela lê a lista de passos.
// =============================================================================

// Os três passos: o texto da lista e o que "digita" no mini formulário.
const PASSOS = [
  {
    Icone: IconePessoa,
    titulo: 'Seu telefone',
    texto: 'O mesmo que você usa para entrar, com DDD.',
    rotulo: 'Telefone',
    valor: '(81) 9 0000-0002',
  },
  {
    Icone: IconeCadeado,
    titulo: 'O código que você anotou',
    texto: 'São 12 letras e números, recebidos quando você criou a conta.',
    rotulo: 'Código de recuperação',
    valor: 'K7QM-4TXD-9HWB',
  },
  {
    Icone: IconeVerificado,
    titulo: 'Uma senha nova',
    texto: 'Depois de trocar, você recebe um código novo. O antigo deixa de valer.',
    rotulo: 'Senha nova',
    valor: '••••••••',
  },
]

// O passo 3 (índice 3) é o final: senha trocada.
const PASSO_FINAL = PASSOS.length

// Tempos do motion, em milissegundos.
const TEMPO = {
  letra: 70, // entre uma letra e outra
  pausaNoCampo: 700, // campo cheio, antes de ir para o próximo
  final: 2800, // quanto tempo o "Senha trocada" fica na tela
}

// Controla o ciclo: digita o campo do passo atual, letra por letra, e passa para o próximo.
// Recebe se a animação deve ficar parada.
// Devolve { passo, letras }: o passo atual (0 a 3) e quantas letras dele já apareceram.
function useCicloDaRecuperacao(parado) {
  const [estado, setEstado] = useState({ passo: 0, letras: 0 })

  useEffect(() => {
    if (parado) {
      return undefined
    }

    const { passo, letras } = estado
    let espera = 0
    let proximo = estado

    if (passo === PASSO_FINAL) {
      // Mostrou o final: recomeça do primeiro passo.
      espera = TEMPO.final
      proximo = { passo: 0, letras: 0 }
    } else if (letras < PASSOS[passo].valor.length) {
      // Ainda digitando o campo atual.
      espera = TEMPO.letra
      proximo = { passo, letras: letras + 1 }
    } else {
      // Campo cheio: espera um pouco e vai para o próximo passo.
      espera = TEMPO.pausaNoCampo
      proximo = { passo: passo + 1, letras: 0 }
    }

    const relogio = setTimeout(() => setEstado(proximo), espera)

    // Ao sair da tela, cancela a espera.
    return () => clearTimeout(relogio)
  }, [estado, parado])

  // Parado: tudo preenchido e a senha já trocada.
  return parado ? { passo: PASSO_FINAL, letras: 0 } : estado
}

// Um campo do mini formulário.
// Recebe o passo do campo, o passo atual e quantas letras já foram digitadas.
// Devolve o campo: vazio (ainda não chegou), digitando (com cursor) ou feito (com ✓).
function CampoDaDemo({ indice, passoAtual, letras }) {
  const { rotulo, valor } = PASSOS[indice]
  const feito = passoAtual > indice
  const digitando = passoAtual === indice
  const texto = feito ? valor : digitando ? valor.slice(0, letras) : ''

  const classes = ['demo-recuperar__campo']
  if (digitando) classes.push('demo-recuperar__campo--ativo')
  if (feito) classes.push('demo-recuperar__campo--feito')

  return (
    <div className={classes.join(' ')}>
      <span className="demo-recuperar__rotulo">{rotulo}</span>
      <span className="demo-recuperar__valor">
        {texto}
        {digitando ? <span className="demo-recuperar__cursor" /> : null}
        {feito ? <span className="demo-recuperar__ok">✓</span> : null}
      </span>
    </div>
  )
}

// O painel inteiro. Não recebe propriedades. Devolve a <aside>.
export default function PainelRecuperacao() {
  const parado = usePrefereMenosMovimento()
  const { passo, letras } = useCicloDaRecuperacao(parado)
  const trocou = passo === PASSO_FINAL

  return (
    <aside className="conta-painel conta-painel--verde painel-recuperar" aria-label="Sua conta de volta em 3 passos">
      <span className="conta-painel__circulo conta-painel__circulo--um" aria-hidden="true" />
      <span className="conta-painel__circulo conta-painel__circulo--dois" aria-hidden="true" />

      <div className="conta-painel__conteudo">
        <p className="conta-painel__olho">Como funciona</p>
        <p className="conta-painel__titulo">Sua conta de volta em 3 passos</p>

        {/* Mini formulário que se preenche sozinho (decorativo). */}
        <div className="demo-recuperar" aria-hidden="true">
          {PASSOS.map((item, indice) => (
            <CampoDaDemo key={item.rotulo} indice={indice} passoAtual={passo} letras={letras} />
          ))}

          <div className={trocou ? 'demo-recuperar__botao demo-recuperar__botao--ok' : 'demo-recuperar__botao'}>
            {trocou ? 'Senha trocada ✓' : 'Trocar minha senha'}
          </div>

          {/* Selo do código novo: só aparece no final, e entra animado a cada volta. */}
          {trocou ? (
            <div className="demo-recuperar__codigo-novo">
              Código novo: <strong>R2PX-8KDN-4QZT</strong>
            </div>
          ) : null}
        </div>

        {/* A lista de passos: o passo que está acontecendo acende. */}
        <ol className="conta-painel__itens painel-recuperar__passos">
          {PASSOS.map(({ Icone, titulo, texto }, indice) => {
            const aceso = parado || passo === indice || (trocou && indice === PASSOS.length - 1)

            return (
              <li key={titulo} className={aceso ? 'painel-recuperar__passo--aceso' : undefined}>
                <span className="conta-painel__icone" aria-hidden="true">
                  <Icone />
                </span>
                <span>
                  <strong>{titulo}</strong>
                  {texto}
                </span>
              </li>
            )
          })}
        </ol>

        <p className="conta-painel__rodape">
          <IconeEscudo />
          <span>A equipe do ISAC nunca pede a sua senha.</span>
        </p>
      </div>
    </aside>
  )
}
