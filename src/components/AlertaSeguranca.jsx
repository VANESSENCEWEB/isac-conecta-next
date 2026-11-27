import { IconeEscudo, IconeSeta } from './Icones.jsx'
import './AlertaSeguranca.css'

// Veio do AlertaSeguranca.jsx do PI sem mudança.
// Faixa verde "Negocie com segurança", igual na vitrine e no detalhe.
// Não recebe argumentos.
// Devolve o aviso. O toque que abre os termos entra numa etapa seguinte.
export default function AlertaSeguranca() {
  return (
    <aside className="alerta-seguranca">
      <span className="alerta-seguranca__icone" aria-hidden="true">
        <IconeEscudo />
      </span>
      <span className="alerta-seguranca__texto">
        <strong>Negocie com segurança</strong>
        <span>Combine em local público e nunca pague antes de conferir.</span>
      </span>
      <span className="alerta-seguranca__seta" aria-hidden="true">
        <IconeSeta />
      </span>
    </aside>
  )
}
