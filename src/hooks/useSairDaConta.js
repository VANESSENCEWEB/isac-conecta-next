'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { sair } from '@/services/auth'
import { useSessaoStore } from '@/store/useSessaoStore'

// Sai da conta e leva a pessoa para o início. Usado pelo cabeçalho e pela barra de baixo.
// Veio do useSairDaConta.js do PI; no Next, useNavigate → useRouter.
// Não recebe argumentos.
// Devolve { saindo, aoSair, erro }: saindo = está saindo agora; aoSair = função do botão;
// erro = frase quando não deu para sair (o botão continua lá para tentar de novo).
export default function useSairDaConta() {
  const router = useRouter()
  const clienteQuery = useQueryClient()
  const esquecerConta = useSessaoStore((estado) => estado.esquecerConta)
  const [saindo, setSaindo] = useState(false)
  const [erro, setErro] = useState('')

  async function aoSair() {
    if (saindo) {
      return
    }

    setSaindo(true)
    setErro('')
    const falha = await sair()
    setSaindo(false)

    if (falha) {
      setErro(falha)
      return
    }

    // O OuvirSessao também limparia a store quando o Supabase avisar,
    // mas limpar aqui faz o cabeçalho trocar na hora, sem esperar o aviso.
    esquecerConta()
    // Joga fora os dados que o TanStack Query guardou desta conta (ex.: "meus anúncios"),
    // para a próxima pessoa que usar o aparelho não ver nada do anterior.
    clienteQuery.clear()
    router.push('/')
  }

  return { saindo, aoSair, erro }
}
