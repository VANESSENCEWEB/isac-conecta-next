import { obterSupabase, supabaseEstaConfigurado } from '@/lib/supabase'
import { limparCodigo, mensagemDeGerarCodigo } from '@/utils/codigoRecuperacao'

// =============================================================================
// SERVIÇO DE CONTA (login, logout, esqueci a senha). Copiado do PI quase sem mudança.
// O login é por telefone + senha. Por baixo, o Supabase usa um "e-mail técnico"
// (81999999999@tel.isacconecta.app), porque o Auth dele pede um e-mail.
// =============================================================================

const DOMINIO_TECNICO = 'tel.isacconecta.app'
// Versão dos Termos que a pessoa aceita ao criar a conta (guardada em perfis_privados).
// No PI vinha de src/dados/textosLegais.js; aqui a página de Termos não foi trazida,
// então o número fica direto, igual ao do PI.
const VERSAO_TERMOS = '1.1'

// Tira tudo que não é número. O banco só aceita o telefone com DDD, sem máscara.
// Recebe o que a pessoa digitou, por exemplo "(81) 99999-9999".
// Devolve só os dígitos, por exemplo "81999999999".
export function apenasNumeros(texto) {
  return String(texto || '').replace(/\D/g, '')
}

// Junta o DDD e o número e confere o tamanho que o gatilho aceita.
// Recebe as duas partes, ou o telefone inteiro na primeira.
// Devolve true quando ficam 10 ou 11 números.
export function telefoneValido(telefone, complemento = '') {
  const digitos = apenasNumeros(`${telefone}${complemento}`)
  return digitos.length === 10 || digitos.length === 11
}

// A senha da tela: pelo menos 8 caracteres, com letra e número.
// Recebe o texto da senha.
// Devolve true quando ela passa nessa regra.
export function senhaValida(senha) {
  return senha.length >= 8 && /[A-Za-zÀ-ÿ]/.test(senha) && /[0-9]/.test(senha)
}

// Monta o e-mail que o Supabase usa no lugar do telefone. Ele não recebe mensagem.
// Recebe o telefone, com ou sem máscara.
// Devolve "81999999999@tel.isacconecta.app", ou vazio se o telefone não servir.
export function montarEmailTecnico(telefone) {
  const digitos = apenasNumeros(telefone)

  if (!telefoneValido(digitos)) {
    return ''
  }

  return `${digitos}@${DOMINIO_TECNICO}`
}

// Traduz o erro do Supabase para uma frase que a pessoa entende.
// Recebe o erro e se a ação foi "entrar" ou "cadastrar".
// Devolve a frase. Não devolve código, SQL nem o telefone.
export function mensagemAmigavel(erro, acao) {
  const texto = String(erro?.message || erro || '').toLowerCase()

  if (texto.includes('failed to fetch') || texto.includes('network') || texto.includes('load failed')) {
    return 'Sem conexão. Verifique a internet e tente de novo.'
  }

  if (texto.includes('invalid login') || texto.includes('invalid credentials')) {
    return 'Telefone ou senha incorretos.'
  }

  if (texto.includes('already registered') || texto.includes('already been registered')) {
    return 'Este telefone já tem uma conta. Toque em Entrar.'
  }

  if (texto.includes('email not confirmed') || texto.includes('not confirmed')) {
    return 'Ainda não deu para entrar. Fale com o ISAC e tente de novo.'
  }

  if (texto.includes('too many') || texto.includes('rate limit')) {
    return 'Muitas tentativas. Espere um pouco e tente de novo.'
  }

  if (texto.includes('termos')) {
    return 'É preciso aceitar os Termos de uso.'
  }

  if (texto.includes('telefone') || texto.includes('cadastro inválido') || texto.includes('cadastro invalido')) {
    return 'Use o telefone com DDD, só números.'
  }

  if (texto.includes('password') || texto.includes('senha')) {
    return 'A senha precisa ter pelo menos 8 caracteres, com letras e números.'
  }

  if (texto.includes('não está configurado') || texto.includes('nao esta configurado')) {
    return 'O cadastro ainda não está ligado neste computador.'
  }

  if (acao === 'entrar') {
    return 'Não foi possível entrar. Tente de novo.'
  }

  return 'Não foi possível criar a conta. Tente de novo.'
}

// Cria a conta. O gatilho do banco cria perfis e perfis_privados sozinho.
// Recebe nome, telefone (com DDD), bairro e senha. O aceite dos Termos vai sempre verdadeiro.
// Devolve a sessão nova. Se não der, devolve o erro já em frase simples.
export async function cadastrar({ nome, telefone, bairro, senha }) {
  if (!supabaseEstaConfigurado()) {
    return { sessao: null, erro: 'O cadastro ainda não está ligado neste computador.' }
  }

  const email = montarEmailTecnico(telefone)

  if (!email) {
    return { sessao: null, erro: 'Use o telefone com DDD, só números.' }
  }

  const { data, error } = await obterSupabase().auth.signUp({
    email,
    password: senha,
    options: {
      data: {
        nome: nome.trim(),
        bairro: bairro.trim(),
        aceitou_termos: true,
        versao_termos: VERSAO_TERMOS,
      },
    },
  })

  if (error) {
    return { sessao: null, erro: mensagemAmigavel(error, 'cadastrar') }
  }

  // Quando o telefone já existe, o Supabase às vezes responde sem erro e sem identidade nova.
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    return { sessao: null, erro: 'Este telefone já tem uma conta. Toque em Entrar.' }
  }

  if (!data.session) {
    return {
      sessao: null,
      erro: 'Sua conta foi criada, mas ainda não deu para entrar. Fale com o ISAC e tente de novo.',
    }
  }

  return { sessao: data.session, erro: '' }
}

// Entra com o telefone e a senha. Por baixo, o login é o e-mail técnico.
// Recebe telefone e senha.
// Devolve a sessão, ou uma frase de erro sem detalhe técnico.
export async function entrar({ telefone, senha }) {
  if (!supabaseEstaConfigurado()) {
    return { sessao: null, erro: 'O cadastro ainda não está ligado neste computador.' }
  }

  const email = montarEmailTecnico(telefone)

  if (!email) {
    return { sessao: null, erro: 'Use o telefone com DDD, só números.' }
  }

  const { data, error } = await obterSupabase().auth.signInWithPassword({
    email,
    password: senha,
  })

  if (error || !data.session) {
    return { sessao: null, erro: mensagemAmigavel(error, 'entrar') }
  }

  return { sessao: data.session, erro: '' }
}

// Sai da conta neste aparelho.
// Não recebe argumentos.
// Devolve uma frase de erro, ou vazio quando deu certo.
export async function sair() {
  if (!supabaseEstaConfigurado()) {
    return ''
  }

  const { error } = await obterSupabase().auth.signOut()

  if (error) {
    return 'Não foi possível sair. Tente de novo.'
  }

  return ''
}

// Lê o apelido, o bairro e o papel de quem acabou de entrar.
// Recebe o id da conta.
// Devolve { nome, bairro, papel }. O papel vem de perfis_privados, não de perfis.
// Não devolve telefone.
export async function buscarPerfil(usuarioId) {
  const supabase = obterSupabase()
  const [publico, privado] = await Promise.all([
    supabase.from('perfis').select('nome, bairro').eq('id', usuarioId).maybeSingle(),
    supabase.from('perfis_privados').select('papel, telefone').eq('id', usuarioId).maybeSingle(),
  ])

  if (publico.error || privado.error || !privado.data) {
    return null
  }

  const papel = privado.data.papel

  if (papel !== 'morador' && papel !== 'comercio' && papel !== 'moderador') {
    return null
  }

  return {
    nome: publico.data?.nome || '',
    bairro: publico.data?.bairro || '',
    papel,
    // O telefone da própria conta (o RLS só deixa ler o seu). Usado para travar o
    // WhatsApp do anúncio na Revisão. Nunca vai para o console.
    telefone: privado.data.telefone || '',
  }
}

// Avisa quando a pessoa entra, sai ou quando a aba reabre a conta salva.
// Recebe a função que vai receber o id da conta, ou null se saiu.
// Devolve uma função para parar de escutar.
export function observarSessao(quandoMudar) {
  const { data } = obterSupabase().auth.onAuthStateChange((evento, sessao) => {
    quandoMudar(sessao?.user?.id || null, evento)
  })

  return () => data.subscription.unsubscribe()
}

// =============================================================================
// CÓDIGO DE RECUPERAÇÃO DA SENHA (D25)
// O banco sorteia e guarda só o "hash" do código. Quem esquece a senha usa o código
// na Edge Function "recuperar-senha", que confere e troca a senha.
// =============================================================================

// Gera o código de recuperação de quem está logado (cadastro novo ou Meus dados).
// Não recebe argumentos.
// Devolve { codigo, erro }. O código (XXXX-XXXX-XXXX) vem só desta vez: o banco não guarda o texto.
// Gerar outro faz o código antigo parar de valer.
export async function gerarCodigoDeRecuperacao() {
  if (!supabaseEstaConfigurado()) {
    return { codigo: '', erro: 'O cadastro ainda não está ligado neste computador.' }
  }

  const { data, error } = await obterSupabase().rpc('gerar_codigo_recuperacao')

  if (error || typeof data !== 'string' || !data) {
    return { codigo: '', erro: mensagemDeGerarCodigo(error) }
  }

  return { codigo: data, erro: '' }
}

// Pergunta se a conta já tem um código (para o Meus dados escolher entre "Gerar" e "Gerar outro").
// Não recebe argumentos.
// Devolve true, false, ou null se não deu para saber. Nunca devolve pista do código.
export async function temCodigoDeRecuperacao() {
  if (!supabaseEstaConfigurado()) {
    return null
  }

  const { data, error } = await obterSupabase().rpc('tem_codigo_recuperacao')

  if (error || typeof data !== 'boolean') {
    return null
  }

  return data
}

// Lê a frase de erro que a Edge Function mandou (ela sempre responde { erro: "frase" }).
// Recebe o erro devolvido por functions.invoke.
// Devolve a frase, ou vazio se não houver uma.
export async function fraseDaFuncao(erro) {
  try {
    const corpo = await erro?.context?.json?.()
    return typeof corpo?.erro === 'string' ? corpo.erro : ''
  } catch {
    return ''
  }
}

// Troca a senha de quem esqueceu, usando o código de recuperação.
// Recebe { telefone, codigo, senha }: telefone com DDD (só números), o código e a senha nova.
// Devolve { codigoNovo, erro }. Se der certo, codigoNovo é o código que vale daqui para frente
// (o antigo foi usado) e a tela precisa mostrá-lo para a pessoa anotar.
export async function recuperarSenha({ telefone, codigo, senha }) {
  if (!supabaseEstaConfigurado()) {
    return { codigoNovo: '', erro: 'O cadastro ainda não está ligado neste computador.' }
  }

  const { data, error } = await obterSupabase().functions.invoke('recuperar-senha', {
    body: { telefone: apenasNumeros(telefone), codigo: limparCodigo(codigo), senha },
  })

  if (error) {
    const frase = await fraseDaFuncao(error)
    const semConexao = String(error?.message || '').toLowerCase().includes('failed to send')

    return {
      codigoNovo: '',
      erro:
        frase ||
        (semConexao
          ? 'Sem conexão. Verifique a internet e tente de novo.'
          : 'Não deu para recuperar a senha agora. Tente de novo em instantes.'),
    }
  }

  if (!data?.ok || typeof data.codigo_novo !== 'string') {
    return { codigoNovo: '', erro: 'Não deu para recuperar a senha agora. Tente de novo em instantes.' }
  }

  return { codigoNovo: data.codigo_novo, erro: '' }
}
