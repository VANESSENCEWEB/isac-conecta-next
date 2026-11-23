// Regras do nome, do celular e da senha nas telas de Cadastro e Entrar.
// São funções puras: não leem a tela nem o banco. Os testes chamam elas direto.

const PARTICULAS = new Set(['da', 'de', 'do', 'das', 'dos', 'e'])

// DDDs em uso no Brasil. Ficam de fora os números que a Anatel não atribuiu, como 23 e 90.
const DDDS_BRASIL = [
  '11', '12', '13', '14', '15', '16', '17', '18', '19',
  '21', '22', '24', '27', '28',
  '31', '32', '33', '34', '35', '37', '38',
  '41', '42', '43', '44', '45', '46', '47', '48', '49',
  '51', '53', '54', '55',
  '61', '62', '63', '64', '65', '66', '67', '68', '69',
  '71', '73', '74', '75', '77', '79',
  '81', '82', '83', '84', '85', '86', '87', '88', '89',
  '91', '92', '93', '94', '95', '96', '97', '98', '99',
]

const DDDS = new Set(DDDS_BRASIL)

// Tira o que o nome não pode ter e limita a 40 caracteres.
// Recebe o texto digitado.
// Devolve só letras (com acento), espaço, hífen e apóstrofo.
export function limparNome(texto) {
  return String(texto || '')
    .replace(/[^\p{L}\s'’-]/gu, '')
    .slice(0, 40)
}

// Põe maiúscula na primeira letra de cada palavra.
// Recebe o nome já digitado.
// Devolve o nome arrumado. "da", "de", "do", "das", "dos" e "e" ficam minúsculos, menos no começo.
export function formatarNome(texto) {
  const limpo = limparNome(texto).trim().replace(/\s+/g, ' ')

  if (!limpo) {
    return ''
  }

  return limpo.split(' ').map((palavra, indice) => formatarPalavra(palavra, indice)).join(' ')
}

// Arruma uma palavra do nome, inclusive as partes ligadas por hífen.
// Recebe a palavra e a posição dela (0 é a primeira).
// Devolve a palavra com a caixa certa.
function formatarPalavra(palavra, indice) {
  const minuscula = palavra.toLocaleLowerCase('pt-BR')

  if (indice > 0 && PARTICULAS.has(minuscula)) {
    return minuscula
  }

  return minuscula
    .split('-')
    .map((parte) => capitalizar(parte))
    .join('-')
}

// Sobe só a primeira letra.
// Recebe um pedaço de palavra.
// Devolve o pedaço capitalizado, ou vazio.
function capitalizar(parte) {
  if (!parte) {
    return ''
  }

  return parte.charAt(0).toLocaleUpperCase('pt-BR') + parte.slice(1)
}

// Diz se o nome já pode ir para o cadastro.
// Recebe o texto do campo.
// Devolve true quando, sem espaços nas pontas, tem de 2 a 40 caracteres permitidos.
export function nomeValido(texto) {
  return erroDoNome(texto) === ''
}

// Explica o que falta no nome. Não olha se a pessoa já saiu do campo.
// Recebe o texto do campo.
// Devolve a frase, ou vazio quando o nome serve.
export function erroDoNome(texto) {
  const limpo = String(texto || '').trim()

  if (limpo.length < 2) {
    return 'Escreva seu nome, com pelo menos 2 letras.'
  }

  if (limpo.length > 40) {
    return 'O nome pode ter no máximo 40 caracteres.'
  }

  if (!/^[\p{L}\s'’-]+$/u.test(limpo)) {
    return 'Use só letras, espaço, hífen e apóstrofo.'
  }

  return ''
}

// Fica só com os números, no máximo 11.
// Recebe o que está no campo, com ou sem máscara.
// Devolve os dígitos, por exemplo "81999999999".
export function digitosDoTelefone(texto) {
  return String(texto || '').replace(/\D/g, '').slice(0, 11)
}

// Monta a máscara enquanto a pessoa digita.
// Recebe o texto atual do campo.
// Devolve "(81) 9 9999-9999", no tanto que já foi digitado.
export function mascararTelefone(texto) {
  const digitos = digitosDoTelefone(texto)

  if (!digitos) {
    return ''
  }

  if (digitos.length < 2) {
    return `(${digitos}`
  }

  let mascara = `(${digitos.slice(0, 2)})`

  if (digitos.length === 2) {
    return mascara
  }

  mascara += ` ${digitos.slice(2, 3)}`

  if (digitos.length <= 3) {
    return mascara
  }

  mascara += ` ${digitos.slice(3, 7)}`

  if (digitos.length <= 7) {
    return mascara
  }

  return `${mascara}-${digitos.slice(7)}`
}

// Confere se aqueles dois números são um DDD brasileiro.
// Recebe o DDD, só os dois dígitos.
// Devolve true quando ele está na lista.
export function dddExiste(ddd) {
  return DDDS.has(String(ddd || ''))
}

// Confere o celular completo: 11 números, DDD real e 9 depois do DDD.
// Recebe o campo, com ou sem máscara.
// Devolve true quando o número pode ser usado.
export function telefoneCelularValido(texto) {
  return erroDoTelefone(texto) === ''
}

// Explica o que falta no telefone.
// Recebe o campo, com ou sem máscara.
// Devolve a frase, ou vazio quando o celular serve.
export function erroDoTelefone(texto) {
  const digitos = digitosDoTelefone(texto)

  if (!digitos) {
    return 'Informe o celular com DDD.'
  }

  if (digitos.length < 11) {
    const falta = 11 - digitos.length
    return falta === 1 ? 'Falta 1 número' : `Faltam ${falta} números`
  }

  if (!dddExiste(digitos.slice(0, 2))) {
    return 'Esse DDD não existe'
  }

  if (digitos[2] !== '9') {
    return 'Celular começa com 9 depois do DDD'
  }

  return ''
}

// Separa as três regras da senha, para o checklist pintar uma por uma.
// Recebe a senha.
// Devolve { caracteres, letra, numero, valida }.
export function regrasDaSenha(senha) {
  const texto = String(senha || '')
  const caracteres = texto.length >= 8
  const letra = /\p{L}/u.test(texto)
  const numero = /[0-9]/.test(texto)

  return {
    caracteres,
    letra,
    numero,
    valida: caracteres && letra && numero,
  }
}

// Compara a senha com a confirmação.
// Recebe as duas. As duas precisam ter algum texto.
// Devolve true só quando elas são iguais e não estão vazias.
export function senhasIguais(senha, confirmacao) {
  return Boolean(senha) && senha === confirmacao
}

// Explica a confirmação quando ela não bate.
// Recebe a senha e a repetição.
// Devolve a frase, ou vazio quando ainda está vazia ou quando já é igual.
export function erroDaConfirmacao(senha, confirmacao) {
  if (!confirmacao) {
    return 'Repita a senha.'
  }

  if (senha !== confirmacao) {
    return 'As senhas não são iguais.'
  }

  return ''
}

// Confere o bairro. Nesta tela ele só precisa estar preenchido.
// Recebe o texto do campo.
// Devolve a frase, ou vazio quando serve.
export function erroDoBairro(bairro) {
  if (!String(bairro || '').trim()) {
    return 'Informe o bairro.'
  }

  return ''
}

// Junta todas as regras do botão Criar conta.
// Recebe nome, telefone, bairro, senha, confirmação e se os termos foram aceitos.
// Devolve true só quando dá para habilitar o botão.
export function cadastroEstaValido({ nome, telefone, bairro, senha, confirmacao, aceitou }) {
  return nomeValido(nome)
    && telefoneCelularValido(telefone)
    && erroDoBairro(bairro) === ''
    && regrasDaSenha(senha).valida
    && senhasIguais(senha, confirmacao)
    && aceitou === true
}
