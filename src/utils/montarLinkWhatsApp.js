// Monta o link do WhatsApp com a mensagem já codificada.
// Recebe o número (só dígitos) e o título do anúncio.
// Devolve a URL https://wa.me/... pronta para abrir.
export function montarLinkWhatsApp(numero, titulo) {
  const mensagem = `Olá! Vi o anúncio "${titulo}" no ISAC Conecta e quero saber mais.`
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`
}
