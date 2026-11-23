import Link from 'next/link'
import './TelaEmConstrucao.css'

// Página provisória usada enquanto a tela de verdade não fica pronta.
// Recebe o título da tela e o dia do plano em que ela vai ser feita (ex.: "Dia 3").
// Devolve a página com um link de volta para o início, feito com next/link.
export default function TelaEmConstrucao({ titulo, dia, children }) {
  return (
    <main className="em-construcao">
      <h1>{titulo}</h1>
      <p>Esta tela fica pronta no {dia}.</p>
      {children}
      <Link href="/">← Voltar para o início</Link>
    </main>
  )
}
