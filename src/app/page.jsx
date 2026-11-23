import Link from 'next/link'
import FaixaCategorias from '@/components/FaixaCategorias'
import '@/components/TelaEmConstrucao.css'

// Todas as rotas do site. Cada pasta em src/app vira um endereço.
// Por enquanto a página inicial é só um mapa delas; no Dia 4 ela vira a vitrine.
const rotas = [
  { href: '/entrar', nome: 'Entrar' },
  { href: '/recuperar-senha', nome: 'Esqueci minha senha' },
  { href: '/anuncio/1', nome: 'Detalhe de um anúncio' },
  { href: '/anuncio/1/editar', nome: 'Editar anúncio' },
  { href: '/publicar', nome: 'Publicar anúncio' },
  { href: '/meus-anuncios', nome: 'Meus anúncios' },
  { href: '/categorias', nome: 'Categorias' },
  { href: '/destaques', nome: 'Destaques' },
]

export default function Home() {
  return (
    <main className="em-construcao">
      <h1>ISAC Conecta</h1>
      {/* Categorias vindas do Supabase (TanStack Query), com o filtro no Zustand. */}
      <FaixaCategorias />
      <p>A vitrine do bairro entra aqui no Dia 4. Por enquanto, as telas do site:</p>
      <ul>
        {rotas.map((rota) => (
          <li key={rota.href}>
            <Link href={rota.href}>{rota.nome}</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
