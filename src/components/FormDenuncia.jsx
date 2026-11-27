'use client'

import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import Botao from './Botao.jsx'
import { denunciarAnuncio } from '@/services/denuncias'
import { erroDaDenuncia, LIMITE_DETALHE, MOTIVOS_DE_DENUNCIA } from '@/utils/denuncias'
import './FormDenuncia.css'

// =============================================================================
// FORMULÁRIO "DENUNCIAR ANÚNCIO", aberto dentro do detalhe.
// Veio do FormDenuncia.jsx do PI. Mudou: o envio era um useState "enviando" +
// await; agora é um useMutation do TanStack Query, que cuida do "enviando",
// do erro e do "deu certo" (isPending, error, isSuccess).
// Funciona com ou sem conta. A pessoa escolhe o motivo e, se quiser, conta o que viu.
// =============================================================================

// Recebe o id do anúncio e a função que fecha o formulário.
// Devolve o formulário, ou o agradecimento depois de enviar.
export default function FormDenuncia({ anuncioId, onFechar }) {
  const [motivo, setMotivo] = useState('')
  const [detalhe, setDetalhe] = useState('')
  const [tentou, setTentou] = useState(false)
  const tituloRef = useRef(null)
  const erro = tentou ? erroDaDenuncia({ motivo, detalhe }) : ''

  const envio = useMutation({ mutationFn: denunciarAnuncio })

  // Quando o formulário abre (ou vira agradecimento), o foco vai para o título:
  // assim quem usa leitor de tela ou teclado sabe que algo novo apareceu.
  useEffect(() => {
    tituloRef.current?.focus()
  }, [envio.isSuccess])

  // Confere e manda a denúncia para o banco.
  // Recebe o envio do formulário. Não devolve valor.
  function aoEnviar(evento) {
    evento.preventDefault()
    setTentou(true)

    if (erroDaDenuncia({ motivo, detalhe })) {
      return
    }

    envio.mutate({ anuncioId, motivo, detalhe })
  }

  if (envio.isSuccess) {
    return (
      <div className="denuncia denuncia--enviada" role="status">
        <h2 tabIndex={-1} ref={tituloRef}>
          Obrigado!
        </h2>
        <p>A equipe do ISAC vai conferir este anúncio. Quem anunciou não fica sabendo quem denunciou.</p>
        <Botao tipo="cancelar" onClick={onFechar}>
          Fechar
        </Botao>
      </div>
    )
  }

  return (
    <form className="denuncia" onSubmit={aoEnviar} aria-labelledby="titulo-denuncia" noValidate>
      <h2 id="titulo-denuncia" tabIndex={-1} ref={tituloRef}>
        Denunciar anúncio
      </h2>
      <p className="denuncia__ajuda">A denúncia vai para a equipe do ISAC. Quem anunciou não vê quem denunciou.</p>

      <fieldset className="denuncia__motivos">
        <legend>O que está errado?</legend>
        {MOTIVOS_DE_DENUNCIA.map((item) => (
          <label key={item} className={motivo === item ? 'denuncia__motivo denuncia__motivo--marcado' : 'denuncia__motivo'}>
            <input type="radio" name="motivo-denuncia" value={item} checked={motivo === item} onChange={() => setMotivo(item)} />
            {item}
          </label>
        ))}
      </fieldset>

      <div className="denuncia__campo">
        <label htmlFor="detalhe-denuncia">
          Conte o que você viu {motivo === 'Outro motivo' ? '(obrigatório)' : '(opcional)'}
        </label>
        <textarea
          id="detalhe-denuncia"
          rows={3}
          maxLength={LIMITE_DETALHE}
          value={detalhe}
          placeholder="Ex.: Pediu Pix adiantado antes de mostrar o produto."
          onChange={(evento) => setDetalhe(evento.target.value)}
        />
        <p className="denuncia__contador">
          {detalhe.length} / {LIMITE_DETALHE} · Não escreva telefone nem dados pessoais.
        </p>
      </div>

      {erro ? (
        <p className="denuncia__erro" role="alert">
          {erro}
        </p>
      ) : null}
      {envio.isError ? (
        <p className="denuncia__erro" role="alert">
          {envio.error.message}
        </p>
      ) : null}

      <div className="denuncia__acoes">
        <Botao tipo="cancelar" onClick={onFechar} desabilitado={envio.isPending}>
          Cancelar
        </Botao>
        <Botao tipo="perigo" type="submit" desabilitado={envio.isPending}>
          {envio.isPending ? 'Enviando…' : 'Enviar denúncia'}
        </Botao>
      </div>
    </form>
  )
}
