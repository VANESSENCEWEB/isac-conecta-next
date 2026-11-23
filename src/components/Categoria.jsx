import './Categoria.css'

// Um botão redondo da faixa de categorias.
// Recebe o nome, o caminho do ícone, a cor do círculo (classe), se está ativa e o clique.
// Devolve o botão com papel de aba.
export default function Categoria({ nome, icone, circulo, ativa = false, onClick }) {
  const classes = ativa ? 'categoria categoria--ativa' : 'categoria'

  return (
    <button className={classes} type="button" role="tab" aria-selected={ativa} onClick={onClick}>
      <span className="categoria__anel">
        <span className={`categoria__circulo categoria__circulo--${circulo}`}>
          <img src={icone} alt="" width="38" height="38" />
        </span>
      </span>
      <span className="categoria__nome">{nome}</span>
      {ativa ? <span className="categoria__ponto" aria-hidden="true" /> : <span className="categoria__ponto categoria__ponto--vazio" aria-hidden="true" />}
    </button>
  )
}
