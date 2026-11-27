import { IconeConversa } from './Icones.jsx'
import './SeloWhatsapp.css'

// Veio do SeloWhatsapp.jsx do PI sem mudança.
// Selo "WhatsApp confirmado": a equipe do ISAC já conferiu que o número é da pessoa.
// É diferente do "Verificado" (azul), que é do comércio que o ISAC conhece.
// Recebe o tamanho: "normal" (Detalhe) ou "pequeno" (cartões e listas).
// Devolve a pílula verde. O texto fica visível: não depende só de cor ou de ícone.
export default function SeloWhatsapp({ tamanho = 'normal' }) {
  return (
    <span className={`selo-whatsapp selo-whatsapp--${tamanho}`}>
      <IconeConversa />
      WhatsApp confirmado
    </span>
  )
}
