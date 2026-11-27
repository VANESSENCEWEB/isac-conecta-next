// =============================================================================
// FOTO DE PERFIL (regras puras)
// O banco guarda só o caminho ("<id da conta>/<id da foto>.webp"). Aqui o caminho vira
// o endereço da imagem, mas só se tiver o formato certo (nada de link de outro site).
// =============================================================================

export const LADO_DO_AVATAR = 400 // a foto de perfil fica com 400 × 400

// Monta o endereço da foto de perfil.
// Recebe o caminho guardado em perfis.foto e o endereço da pasta "avatares".
// Devolve a URL, ou vazio (aí a tela mostra as iniciais).
export function urlDoAvatar(caminho, base) {
  const texto = String(caminho || '')

  if (!base || !/^[0-9a-f-]{36}\/[0-9a-f-]{36}\.(webp|jpg)$/.test(texto)) {
    return ''
  }

  return `${base}${texto}`
}
