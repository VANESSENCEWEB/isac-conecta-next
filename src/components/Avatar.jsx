import { baseDosAvatares } from '@/lib/supabase'
import { urlDoAvatar } from '@/utils/avatar'
import { iniciais } from '@/utils/iniciais'

// A foto de perfil, redonda. Sem foto (ou com caminho estranho), mostra as iniciais do nome.
// Veio do Avatar.jsx do PI sem mudança.
// Recebe o nome, o caminho da foto (perfis.foto) e a classe do tamanho e da cor.
// Devolve a imagem ou o círculo com as iniciais. É enfeite: o nome já aparece ao lado.
export default function Avatar({ nome, foto, className = '' }) {
  const url = urlDoAvatar(foto, baseDosAvatares())

  if (url) {
    // eslint-disable-next-line @next/next/no-img-element -- a foto vem do Storage do Supabase
    return <img className={`${className} avatar-foto`} src={url} alt="" loading="lazy" />
  }

  return (
    <span className={className} aria-hidden="true">
      {iniciais(nome || 'Você')}
    </span>
  )
}
