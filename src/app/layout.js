import { Bricolage_Grotesque, DM_Sans } from 'next/font/google'
import '@/styles/global.css'

// As duas fontes do PI. O next/font baixa os arquivos no build e serve do próprio site,
// então o navegador não precisa ir ao Google. Cada uma vira uma variável CSS,
// que o tokens.css usa em --fonte-titulo e --fonte-texto.
const fonteTitulo = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-bricolage',
})

const fonteTexto = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
})

// Título e descrição que aparecem na aba e no Google (os mesmos do index.html do PI).
export const metadata = {
  title: 'ISAC Conecta · a vitrine do bairro no Cabo de Santo Agostinho',
  description:
    'Produtos, serviços, vagas, imóveis e eventos do bairro num lugar só. Grátis e conferido pelo ISAC.',
  icons: { icon: '/favicon.svg' },
}

// Cor da barra do navegador no celular.
export const viewport = {
  themeColor: '#0f4d3a',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${fonteTitulo.variable} ${fonteTexto.variable}`}>
      <body>{children}</body>
    </html>
  )
}
