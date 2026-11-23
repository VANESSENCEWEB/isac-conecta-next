'use client'

import { useEffect } from 'react'
import { supabaseEstaConfigurado } from '@/lib/supabase'
import { buscarPerfil, observarSessao } from '@/services/auth'
import { useSessaoStore } from '@/store/useSessaoStore'

// Liga o Supabase Auth ao Zustand. Fica no layout e não desenha nada.
// Sempre que alguém entra, sai, ou abre o site já logado, o Supabase avisa
// (onAuthStateChange) e este componente atualiza a store da sessão.
// É o que fazia o ProvedorSessao do PI, só que guardando no Zustand em vez de Context.
// Não recebe propriedades. Devolve null.
export default function OuvirSessao() {
  const guardarConta = useSessaoStore((estado) => estado.guardarConta)
  const esquecerConta = useSessaoStore((estado) => estado.esquecerConta)

  useEffect(() => {
    if (!supabaseEstaConfigurado()) {
      esquecerConta()
      return undefined
    }

    // Evita atualizar a store depois que o componente saiu da tela.
    let viva = true

    const parar = observarSessao((usuarioId) => {
      // O perfil é lido no instante seguinte, para não travar o login do Supabase
      // (o PI já fazia assim: chamar o banco dentro do aviso pode travar o Auth).
      window.setTimeout(async () => {
        if (!viva) {
          return
        }

        if (!usuarioId) {
          esquecerConta()
          return
        }

        try {
          const perfil = await buscarPerfil(usuarioId)

          if (viva) {
            guardarConta({ id: usuarioId, nome: '', bairro: '', papel: null, ...perfil })
          }
        } catch {
          if (viva) {
            guardarConta({ id: usuarioId, nome: '', bairro: '', papel: null })
          }
        }
      }, 0)
    })

    return () => {
      viva = false
      parar()
    }
  }, [guardarConta, esquecerConta])

  return null
}
