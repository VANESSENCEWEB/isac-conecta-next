import { createClient } from '@supabase/supabase-js'

// Guarda o cliente depois da primeira conexão, para não criar outro igual.
let clienteCriado = null

// Lê uma variável do arquivo .env.local. No navegador, o Next só enxerga as que começam com NEXT_PUBLIC_.
// Recebe o nome da variável, por exemplo "NEXT_PUBLIC_SUPABASE_URL".
// Devolve o texto sem espaços, ou vazio se você ainda não colou o valor.
// O nome precisa estar escrito por extenso no código (process.env.NEXT_PUBLIC_...):
// o Next troca esse texto pelo valor no build, e process.env[nome] voltaria vazio.
function lerVariavelDeAmbiente(nome) {
  let valor = ''

  if (nome === 'NEXT_PUBLIC_SUPABASE_URL') {
    valor = process.env.NEXT_PUBLIC_SUPABASE_URL
  }

  if (nome === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
    valor = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }

  if (typeof valor !== 'string') {
    return ''
  }

  return valor.trim()
}

// Arruma a URL do projeto, caso tenha vindo com pedaços a mais.
// Um erro comum é colar a "API URL" com /rest/v1 no fim, ou com uma barra no fim.
// O cliente do Supabase já coloca o /rest/v1 sozinho; com ele duas vezes, o banco
// responde o erro PGRST125 ("caminho inválido").
// Recebe a URL do .env.local (ou da Vercel).
// Devolve só "https://xxxx.supabase.co".
export function limparUrlDoSupabase(url) {
  return String(url || '')
    .trim()
    .replace(/\/+$/, '')
    .replace(/\/(rest|auth|storage|functions)\/v1.*$/i, '')
    .replace(/\/+$/, '')
}

// Diz se a URL e a chave anon já estão no .env.local.
// Não recebe argumentos.
// Devolve true quando as duas estão preenchidas, e false enquanto o cadastro não termina.
// Não mostra os valores. A chave service_role nunca entra aqui.
export function supabaseEstaConfigurado() {
  const url = lerVariavelDeAmbiente('NEXT_PUBLIC_SUPABASE_URL')
  const chaveAnon = lerVariavelDeAmbiente('NEXT_PUBLIC_SUPABASE_ANON_KEY')

  return url !== '' && chaveAnon !== ''
}

// Cria o cliente do Supabase usado pelo front-end.
// Não recebe argumentos: a URL e a chave pública (anon) vêm do .env.local.
// Devolve o cliente que os services vão usar nas próximas etapas.
// Se o .env.local ainda estiver vazio, explica onde colar os dados e não conecta.
function criarClienteSupabase() {
  const url = lerVariavelDeAmbiente('NEXT_PUBLIC_SUPABASE_URL')
  const chaveAnon = lerVariavelDeAmbiente('NEXT_PUBLIC_SUPABASE_ANON_KEY')

  if (!url || !chaveAnon) {
    throw new Error(
      'O Supabase ainda não está configurado. No painel, em Project Settings → API, copie a URL do projeto e a chave anon (pública) para o arquivo .env.local. Não cole a service_role. Depois reinicie o npm run dev.',
    )
  }

  return createClient(limparUrlDoSupabase(url), chaveAnon)
}

// Endereço público da pasta de fotos dos anúncios no Storage (bucket "anuncios", migration 009).
// Não recebe argumentos.
// Devolve "https://xxxx.supabase.co/storage/v1/object/public/anuncios/", ou vazio sem .env.local.
export function baseDasFotos() {
  const url = limparUrlDoSupabase(lerVariavelDeAmbiente('NEXT_PUBLIC_SUPABASE_URL'))
  return url ? `${url}/storage/v1/object/public/anuncios/` : ''
}

// Endereço público da pasta das fotos de perfil (migration 013).
// Não recebe argumentos.
// Devolve "https://<projeto>.supabase.co/storage/v1/object/public/avatares/", ou vazio.
export function baseDosAvatares() {
  const url = limparUrlDoSupabase(lerVariavelDeAmbiente('NEXT_PUBLIC_SUPABASE_URL'))
  return url ? `${url}/storage/v1/object/public/avatares/` : ''
}

// Entrega o cliente pronto.
// Não recebe argumentos.
// Devolve o mesmo cliente em todas as chamadas.
// As telas não usam esta função: só os arquivos de src/services/.
export function obterSupabase() {
  if (!clienteCriado) {
    clienteCriado = criarClienteSupabase()
  }

  return clienteCriado
}
