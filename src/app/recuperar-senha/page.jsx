'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Alerta from '@/components/Alerta.jsx'
import Botao from '@/components/Botao.jsx'
import { Campo, CampoSenha } from '@/components/Campo.jsx'
import CodigoDeRecuperacao from '@/components/CodigoDeRecuperacao.jsx'
import { IconeCadeado, IconeEscudo, IconePessoa, IconeVerificado } from '@/components/Icones.jsx'
import PainelConta from '@/components/PainelConta.jsx'
import { recuperarSenha } from '@/services/auth'
import { codigoCompleto, erroDoCodigo, mascararCodigo } from '@/utils/codigoRecuperacao'
import { destinoSeguro, linkComVolta } from '@/utils/destinoSeguro'
import {
  digitosDoTelefone,
  erroDaConfirmacao,
  erroDoTelefone,
  mascararTelefone,
  regrasDaSenha,
  senhasIguais,
} from '@/utils/validarCadastro'
import '@/components/Conta.css'

// =============================================================================
// TELA ESQUECI MINHA SENHA. Portada do src/pages/RecuperarSenha.jsx do PI.
// Como funciona (igual ao PI): ao criar a conta, a pessoa anota um código de recuperação.
// Aqui ela digita telefone + código + senha nova; a Edge Function "recuperar-senha"
// (no Supabase) confere o código, troca a senha e devolve um código NOVO.
// O que mudou para o Next: 'use client', useNavigate → useRouter, <Link href>,
// sem CascaPagina, e o <Suspense> por causa do useSearchParams (igual ao /entrar).
// =============================================================================

const ITENS_SENHA = [
  { id: 'caracteres', texto: '8 caracteres' },
  { id: 'letra', texto: 'uma letra' },
  { id: 'numero', texto: 'um número' },
]

// Passos do painel verde da direita (só no computador), no mesmo formato do Cadastro do PI.
const PASSOS_DA_RECUPERACAO = [
  { Icone: IconePessoa, titulo: 'Seu telefone', texto: 'O mesmo que você usa para entrar, com DDD.' },
  {
    Icone: IconeCadeado,
    titulo: 'O código que você anotou',
    texto: 'São 12 letras e números, recebidos quando você criou a conta.',
  },
  {
    Icone: IconeVerificado,
    titulo: 'Uma senha nova',
    texto: 'Depois de trocar, você recebe um código novo. O antigo deixa de valer.',
  },
]

// Lista ao vivo do que a senha nova já cumpre.
// Recebe a senha digitada.
// Devolve os três itens, cinza ou verdes.
function ChecklistSenha({ senha }) {
  const regras = regrasDaSenha(senha)

  return (
    <ul className="conta__regras" aria-live="polite">
      {ITENS_SENHA.map((item) => (
        <li key={item.id} className={regras[item.id] ? 'conta__regra conta__regra--ok' : 'conta__regra'}>
          {regras[item.id] ? `✓ ${item.texto}` : item.texto}
        </li>
      ))}
    </ul>
  )
}

// WhatsApp do ISAC (só números, com 55 e DDD). Opcional: vem de NEXT_PUBLIC_ISAC_WHATSAPP
// no .env.local e na Vercel. No PI era VITE_ISAC_WHATSAPP. Vazio = mostra só o texto.
const WHATSAPP_ISAC = String(process.env.NEXT_PUBLIC_ISAC_WHATSAPP || '').replace(/\D/g, '')

// Monta o link do WhatsApp do ISAC para quem perdeu o código.
// Não recebe argumentos.
// Devolve o endereço, ou vazio se o ISAC ainda não configurou o WhatsApp.
function linkDoIsac() {
  if (!WHATSAPP_ISAC) {
    return ''
  }

  const mensagem = 'Olá, equipe do ISAC! Esqueci minha senha e não tenho mais o código de recuperação. Podem me ajudar?'

  return `https://wa.me/${WHATSAPP_ISAC}?text=${encodeURIComponent(mensagem)}`
}

// Tela "Esqueci minha senha": telefone + código de recuperação + senha nova.
// Recebe "voltar": para onde ir depois de entrar de novo, já conferido.
// Devolve o formulário. Se der certo, troca o formulário pelo código NOVO (o antigo foi usado).
function TelaRecuperarSenha({ voltar }) {
  const router = useRouter()
  const [telefone, setTelefone] = useState('')
  const [codigo, setCodigo] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [tocados, setTocados] = useState({})
  const [tentouEnviar, setTentouEnviar] = useState(false)
  const [erroServidor, setErroServidor] = useState('')
  const [enviando, setEnviando] = useState(false)
  // Preenchido quando a senha foi trocada: é o código que vale daqui para frente.
  const [codigoNovo, setCodigoNovo] = useState('')
  const [anotou, setAnotou] = useState(false)

  const linkIsac = linkDoIsac()
  const podeEnviar =
    !erroDoTelefone(telefone) &&
    codigoCompleto(codigo) &&
    regrasDaSenha(senha).valida &&
    senhasIguais(senha, confirmacao)

  // Marca que a pessoa já saiu daquele campo, para o erro poder aparecer.
  // Recebe o nome do campo.
  // Não devolve valor.
  function marcarTocado(campo) {
    setTocados((atual) => ({ ...atual, [campo]: true }))
  }

  // Decide se o erro daquele campo já pode ser lido.
  // Recebe o nome do campo.
  // Devolve true depois que a pessoa saiu dele ou tentou enviar.
  function mostrarErro(campo) {
    return Boolean(tocados[campo] || tentouEnviar)
  }

  // Manda telefone, código e senha nova para a Edge Function conferir e trocar.
  // Recebe o envio do formulário.
  // Não devolve valor. Se der certo, mostra o código novo na tela.
  async function aoEnviar(evento) {
    evento.preventDefault()
    setTentouEnviar(true)

    if (!podeEnviar) {
      return
    }

    setEnviando(true)
    setErroServidor('')
    const resultado = await recuperarSenha({
      telefone: digitosDoTelefone(telefone),
      codigo,
      senha,
    })
    setEnviando(false)

    if (resultado.erro) {
      setErroServidor(resultado.erro)
      return
    }

    // Senha trocada. A senha digitada sai da memória da tela.
    setSenha('')
    setConfirmacao('')
    setCodigoNovo(resultado.codigoNovo)
  }

  // ---- Depois de trocar: mostra o código novo para anotar ----
  if (codigoNovo) {
    return (
      <main className="conta conta--recuperar">
        <div className="conta__coluna">
          <header className="conta__faixa">
            <p className="conta__olho">SENHA TROCADA</p>
            <h1>Anote o código novo</h1>
            <p className="conta__resumo">O código antigo já foi usado. Este é o que vale agora.</p>
          </header>

          <div className="conta__formulario">
            <CodigoDeRecuperacao codigo={codigoNovo} titulo="Seu novo código de recuperação" />

            <div className="conta__aceite">
              <input
                id="anotei"
                type="checkbox"
                checked={anotou}
                onChange={(evento) => setAnotou(evento.target.checked)}
              />
              <label htmlFor="anotei">Já anotei meu código novo em um lugar seguro.</label>
            </div>

            <Botao
              tipo="primario"
              icone
              className="botao--largo"
              desabilitado={!anotou}
              onClick={() => router.push(linkComVolta('/entrar', voltar))}
            >
              Entrar com a senha nova
            </Botao>
          </div>
        </div>
      </main>
    )
  }

  const erroTelefone = mostrarErro('telefone') ? erroDoTelefone(telefone) : ''
  const erroCodigo = mostrarErro('codigo') ? erroDoCodigo(codigo) : ''
  const erroSenha =
    mostrarErro('senha') && !regrasDaSenha(senha).valida
      ? 'A senha precisa ter pelo menos 8 caracteres, com letras e números.'
      : ''
  const erroConfirmacao = mostrarErro('confirmacao') ? erroDaConfirmacao(senha, confirmacao) : ''

  return (
    // "conta--duas-colunas": no computador, formulário à esquerda e painel verde à direita,
    // no mesmo formato do Entrar. No celular continua a faixa verde + formulário.
    <main className="conta conta--duas-colunas">
      <div className="conta__coluna">
        <header className="conta__faixa">
          <p className="conta__olho">RECUPERAR O ACESSO</p>
          <h1>Esqueci minha senha</h1>
          <p className="conta__resumo">Use o código de recuperação que você anotou ao criar a conta.</p>
        </header>

        <form className="conta__formulario" onSubmit={aoEnviar} noValidate>
          {erroServidor ? (
            <Alerta tipo="erro" titulo="Não deu para trocar a senha">
              {erroServidor}
            </Alerta>
          ) : null}

          <Campo
            id="telefone"
            rotulo="Telefone com DDD"
            tipo="tel"
            valor={telefone}
            onChange={(valor) => {
              setTelefone(mascararTelefone(valor))
              setErroServidor('')
            }}
            onBlur={() => marcarTocado('telefone')}
            placeholder="(81) 9 9999-9999"
            autoComplete="tel"
            inputMode="numeric"
            erro={erroTelefone}
          />

          <Campo
            id="codigo"
            className="campo--codigo"
            rotulo="Código de recuperação"
            valor={codigo}
            onChange={(valor) => {
              setCodigo(mascararCodigo(valor))
              setErroServidor('')
            }}
            onBlur={() => marcarTocado('codigo')}
            placeholder="XXXX-XXXX-XXXX"
            ajuda="São 12 letras e números. Pode digitar com ou sem os traços."
            autoComplete="off"
            maxLength={14}
            erro={erroCodigo}
          />

          <CampoSenha
            id="senha"
            rotulo="Senha nova"
            valor={senha}
            onChange={(valor) => {
              setSenha(valor)
              setErroServidor('')
            }}
            onBlur={() => marcarTocado('senha')}
            placeholder="Crie uma senha nova"
            autoComplete="new-password"
            erro={erroSenha}
            extra={<ChecklistSenha senha={senha} />}
          />

          <CampoSenha
            id="confirmacao"
            rotulo="Repita a senha nova"
            valor={confirmacao}
            onChange={(valor) => {
              setConfirmacao(valor)
              setErroServidor('')
            }}
            onBlur={() => marcarTocado('confirmacao')}
            placeholder="Repita a senha"
            autoComplete="new-password"
            erro={erroConfirmacao}
          />

          <Botao tipo="primario" icone className="botao--largo" type="submit" desabilitado={!podeEnviar || enviando}>
            {enviando ? 'Trocando…' : 'Trocar minha senha'}
          </Botao>

          <aside className="conta__nota">
            <IconeEscudo />
            <p>
              <strong>Sem o código?</strong>
              {linkIsac ? (
                <>
                  Fale com o ISAC pelo{' '}
                  <a href={linkIsac} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                  . Nunca passe a sua senha para ninguém.
                </>
              ) : (
                'Fale com a equipe do ISAC. Nunca passe a sua senha para ninguém.'
              )}
            </p>
          </aside>

          <p className="conta__troca">
            Lembrou a senha? <Link href={linkComVolta('/entrar', voltar)}>Entrar</Link>
          </p>
        </form>
      </div>

      <PainelConta
        olho="Como funciona"
        titulo="Sua conta de volta em 3 passos"
        itens={PASSOS_DA_RECUPERACAO}
        rodape="A equipe do ISAC nunca pede a sua senha."
        IconeRodape={IconeEscudo}
      />
    </main>
  )
}

// Lê o ?voltar= do endereço e confere se é do próprio site.
function TelaComVolta() {
  const parametros = useSearchParams()
  return <TelaRecuperarSenha voltar={destinoSeguro(parametros.get('voltar'))} />
}

// Página /recuperar-senha. Mesmo motivo do <Suspense> da página /entrar.
export default function PaginaRecuperarSenha() {
  return (
    <Suspense fallback={<TelaRecuperarSenha voltar="/" />}>
      <TelaComVolta />
    </Suspense>
  )
}
