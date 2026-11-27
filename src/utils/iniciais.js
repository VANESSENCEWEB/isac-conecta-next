// Pega as duas primeiras letras do nome, para o círculo do comércio.
// Recebe o nome.
// Devolve até duas letras maiúsculas, por exemplo "RG".
export function iniciais(nome) {
  return nome
    .split(' ')
    .filter((parte) => parte.length > 0)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()
}
