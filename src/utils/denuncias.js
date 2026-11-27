// =============================================================================
// DENÚNCIAS (regras puras, sem falar com o banco). Veio do utils/denuncias.js do PI, só a parte do formulário
// A lista de motivos é a mesma que o banco aceita (migration 010).
// =============================================================================

export const LIMITE_DETALHE = 500

// Os motivos que a pessoa escolhe ao denunciar.
export const MOTIVOS_DE_DENUNCIA = [
  'Golpe ou fraude',
  'Item proibido',
  'Informação falsa ou enganosa',
  'Anúncio repetido',
  'Conteúdo ofensivo',
  'Usa dados de outra pessoa',
  'Outro motivo',
]

// Confere a denúncia antes de mandar.
// Recebe { motivo, detalhe }.
// Devolve a frase do problema, ou vazio quando dá para enviar.
export function erroDaDenuncia({ motivo = '', detalhe = '' }) {
  if (!MOTIVOS_DE_DENUNCIA.includes(motivo)) {
    return 'Escolha o motivo.'
  }

  if (motivo === 'Outro motivo' && !detalhe.trim()) {
    return 'Conte em poucas palavras o que está errado.'
  }

  if (detalhe.length > LIMITE_DETALHE) {
    return `O detalhe pode ter até ${LIMITE_DETALHE} caracteres.`
  }

  return ''
}

