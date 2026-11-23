import Link from 'next/link'
import './Rodape.css'

// Colunas de links do rodapé. Só telas que existem neste projeto.
const COLUNAS = [
  {
    titulo: 'Explorar',
    links: [
      { rotulo: 'Início', para: '/' },
      { rotulo: 'Destaques', para: '/destaques' },
      { rotulo: 'Categorias', para: '/categorias' },
      { rotulo: 'Anunciar grátis', para: '/publicar' },
    ],
  },
  {
    titulo: 'Sua conta',
    links: [
      { rotulo: 'Entrar', para: '/entrar' },
      { rotulo: 'Esqueci minha senha', para: '/recuperar-senha' },
      { rotulo: 'Meus anúncios', para: '/meus-anuncios' },
    ],
  },
]

// Rodapé de todas as páginas, adaptado do Rodape.jsx do PI (o CSS veio igual).
// Verde da marca: a marca e a frase, as colunas de links e o aviso de responsabilidade.
// É Server Component (não tem estado nem clique), então não precisa de 'use client'.
// Ficaram para depois: o botão "Sair da conta" (Dia 3).
// Não recebe propriedades. Devolve o rodapé.
export default function Rodape() {
  return (
    <footer className="rodape">
      <div className="rodape__miolo">
        <div className="rodape__marca">
          <p className="rodape__nome">
            ISAC <span>Conecta</span>
          </p>
          <p className="rodape__frase">
            Os vizinhos do Cabo, num lugar só. Anúncio grátis e conferido pela equipe do ISAC.
          </p>
        </div>

        <nav className="rodape__colunas" aria-label="Links do rodapé">
          {COLUNAS.map((coluna, indice) => (
            <div key={coluna.titulo} className="rodape__coluna">
              <p className="rodape__titulo" id={`rodape-coluna-${indice}`}>
                {coluna.titulo}
              </p>
              <ul aria-labelledby={`rodape-coluna-${indice}`}>
                {coluna.links.map((link) => (
                  <li key={link.para}>
                    <Link href={link.para}>{link.rotulo}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="rodape__base">
          <p>Os anúncios são de responsabilidade de quem publica. Todo anúncio passa pela equipe do ISAC antes de aparecer.</p>
          <p>
            © 2026 <strong>ISAC Conecta</strong> · Instituto Social e Ambiental do Cabo
          </p>
        </div>
      </div>
    </footer>
  )
}
