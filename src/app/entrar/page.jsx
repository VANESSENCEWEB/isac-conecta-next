'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Alerta from '@/components/Alerta.jsx'
import Botao from '@/components/Botao.jsx'
import { Campo, CampoSenha } from '@/components/Campo.jsx'
import { IconeEscudo } from '@/components/Icones.jsx'
import MapaDoBairro from '@/components/entrar/MapaDoBairro.jsx'
import { entrar } from '@/services/auth'
import { digitosDoTelefone, erroDoTelefone, mascararTelefone } from '@/utils/validarCadastro'
import { destinoSeguro, linkComVolta } from '@/utils/destinoSeguro'
import { textosDoEntrar } from '@/utils/textosEntrar'
import '@/components/Conta.css'

// =============================================================================
// TELA ENTRAR (login com telefone e senha). Portada do src/pages/Entrar.jsx do PI.
// O que mudou do PI para o Next:
//   • 'use client' na primeira linha (a tela tem useState e onSubmit);
//   • useNavigate → useRouter, e navigate(x) → router.push(x);
//   • useSearchParams agora vem de next/navigation;

//   • sem o CascaPagina: o cabeçalho e o rodapé já vêm do layout.js.
// Depois do login, quem guarda a conta no Zustand é o OuvirSessao (o Supabase avisa).
// =============================================================================

// Formulário de entrar.
// Recebe "voltar": para onde ir depois de entrar (ex.: "/publicar"), já conferido.
// Devolve a tela. Se der certo, abre o "voltar".
function TelaEntrar({ voltar }) {
  const router = useRouter()
  // O título muda conforme o motivo de entrar (publicar, convite...).
  const textos = textosDoEntrar(voltar)
  const [telefone, setTelefone] = useState('')
  const [senha, setSenha] = useState('')
  const [tocados, setTocados] = useState({})
  const [tentouEnviar, setTentouEnviar] = useState(false)
  const [erroServidor, setErroServidor] = useState('')
  const [enviando, setEnviando] = useState(false)

  const erroTelefoneCampo = erroDoTelefone(telefone)
  const podeEntrar = erroTelefoneCampo === '' && senha.length > 0

  // Marca que a pessoa já saiu daquele campo.
  // Recebe o nome do campo. Não devolve valor.
  function marcarTocado(campo) {
    setTocados((atual) => ({ ...atual, [campo]: true }))
  }

  // Decide se o erro daquele campo já pode ser lido.
  // Recebe o nome do campo.
  // Devolve true depois que a pessoa saiu dele ou tentou enviar.
  function mostrarErro(campo) {
    return Boolean(tocados[campo] || tentouEnviar)
  }

  // Manda o telefone e a senha para o serviço de login.
  // Recebe o envio do formulário. Não devolve valor.
  async function aoEnviar(evento) {
    evento.preventDefault()
    setTentouEnviar(true)

    if (erroDoTelefone(telefone) || !senha) {
      return
    }

    setEnviando(true)
    setErroServidor('')
    const resultado = await entrar({
      telefone: digitosDoTelefone(telefone),
      senha,
    })
    setEnviando(false)

    if (resultado.erro) {
      setErroServidor(resultado.erro)
      return
    }

    router.push(voltar)
  }

  const erroTelefone = mostrarErro('telefone') ? erroTelefoneCampo : ''
  const erroSenha = mostrarErro('senha') && !senha ? 'Digite a senha.' : ''

  return (
    // "conta--entrar": no computador vira duas colunas (título + login | animação).
    <main className="conta conta--entrar">
      <div className="conta__coluna">
        <header className="conta__faixa">
          <p className="conta__olho">{textos.olho}</p>
          <h1>
            {textos.antes}
            <span className="conta__destaque">{textos.destaque}</span>
            {textos.depois}
          </h1>
          <p className="conta__resumo">{textos.resumo}</p>
        </header>

        <form className="conta__formulario" onSubmit={aoEnviar} noValidate>
          {erroServidor ? (
            <Alerta tipo="erro" titulo="Não deu para entrar">
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
            ajuda="Use o telefone cadastrado na sua conta."
            autoComplete="tel"
            inputMode="numeric"
            erro={erroTelefone}
          />

          <CampoSenha
            id="senha"
            rotulo="Senha"
            valor={senha}
            onChange={(valor) => {
              setSenha(valor)
              setErroServidor('')
            }}
            onBlur={() => marcarTocado('senha')}
            placeholder="Sua senha"
            autoComplete="current-password"
            erro={erroSenha}
          />

          <div className="conta__linha">
            <span>Problemas para entrar?</span>
            <Link href={linkComVolta('/recuperar-senha', voltar)}>Esqueci minha senha</Link>
          </div>

          <Botao tipo="primario" icone className="botao--largo" type="submit" desabilitado={!podeEntrar || enviando}>
            {enviando ? 'Entrando…' : 'Entrar'}
          </Botao>

          <aside className="conta__nota">
            <IconeEscudo />
            <p>
              <strong>Proteja sua conta</strong>
              Não compartilhe sua senha com ninguém, nem com a equipe do ISAC.
            </p>
          </aside>
        </form>
      </div>

      {/* Animação do grupo virando classificados (só aparece no computador). */}
      <div className="conta__mapa">
        <MapaDoBairro />
      </div>
    </main>
  )
}

// Lê o ?voltar= do endereço (ex.: /entrar?voltar=/publicar) e confere se é do próprio site.
function TelaEntrarComVolta() {
  const parametros = useSearchParams()
  return <TelaEntrar voltar={destinoSeguro(parametros.get('voltar'))} />
}

// Página /entrar.
// O useSearchParams só sabe o ?voltar= quando a página abre no navegador. Com o
// cacheComponents ligado, ele precisa de um <Suspense>: até lá aparece a mesma tela,
// voltando para o início.
export default function PaginaEntrar() {
  return (
    <Suspense fallback={<TelaEntrar voltar="/" />}>
      <TelaEntrarComVolta />
    </Suspense>
  )
}
