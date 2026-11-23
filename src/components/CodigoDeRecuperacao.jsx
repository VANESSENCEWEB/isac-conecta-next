'use client'

import { useState } from 'react'
import Alerta from './Alerta.jsx'
import Botao from './Botao.jsx'
import './Conta.css'

// Caixa que mostra o código de recuperação, com o botão de copiar e o aviso de que ele só aparece uma vez.
// Usada no fim do cadastro, no Meus dados e depois de recuperar a senha.
// Recebe o código (XXXX-XXXX-XXXX) e, se quiser, um título para o leitor de tela.
// Devolve a caixa. Não guarda o código em lugar nenhum: ele vive só nesta tela.
export default function CodigoDeRecuperacao({ codigo, titulo = 'Seu código de recuperação' }) {
  const [copiou, setCopiou] = useState(false)
  const [erroAoCopiar, setErroAoCopiar] = useState(false)

  // Copia o código para a área de transferência.
  // Não recebe argumentos.
  // Não devolve valor. Se o aparelho não deixar copiar, pede para a pessoa anotar à mão.
  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo)
      setCopiou(true)
      setErroAoCopiar(false)
    } catch {
      setCopiou(false)
      setErroAoCopiar(true)
    }
  }

  return (
    <section className="codigo" aria-label={titulo}>
      <p className="codigo__rotulo">{titulo}</p>
      <p className="codigo__valor" data-testid="codigo-de-recuperacao">
        {codigo}
      </p>

      <Botao tipo="secundario" type="button" onClick={copiar}>
        {copiou ? 'Código copiado ✓' : 'Copiar código'}
      </Botao>

      {erroAoCopiar ? (
        <p className="codigo__aviso" role="status">
          Não deu para copiar. Anote o código no papel.
        </p>
      ) : null}

      <Alerta tipo="atencao" titulo="Guarde com cuidado">
        Este código só aparece agora. Anote num lugar seguro, como um papel ou o bloco de notas do celular. Quem
        tiver o código e o seu telefone consegue trocar a sua senha: não mostre para ninguém, nem para a equipe do
        ISAC.
      </Alerta>
    </section>
  )
}
