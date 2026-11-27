'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Alerta from './Alerta.jsx'
import AlertaSeguranca from './AlertaSeguranca.jsx'
import Avatar from './Avatar.jsx'
import CardAnuncio from './CardAnuncio.jsx'
import FormDenuncia from './FormDenuncia.jsx'
import GaleriaFotos from './GaleriaFotos.jsx'
import SeloWhatsapp from './SeloWhatsapp.jsx'
import {
  IconeAviso,
  IconeBandeira,
  IconeCompartilhar,
  IconeCoracao,
  IconeEstrela,
  IconePessoa,
  IconePino,
  IconeVerificado,
  IconeVoltar,
} from './Icones.jsx'
import { buscarCategoria } from '@/dados/categorias'
import { useAnuncio, useSemelhantes, useWhatsappConfirmado } from '@/hooks/useAnuncios'
import { useFavoritos } from '@/hooks/useFavoritos'
import { useFiltrosStore } from '@/store/useFiltrosStore'
import { formatarPreco } from '@/utils/formatarPreco'
import { formatarQuando } from '@/utils/formatarQuando'
import { montarLinkWhatsApp } from '@/utils/montarLinkWhatsApp'
import './Botao.css'
import './DetalheAnuncio.css'

// =============================================================================
// DETALHE DE UM ANÚNCIO (/anuncio/<id>)
// Veio do Detalhe.jsx do PI, com o mesmo visual (DetalheAnuncio.css = Detalhe.css do PI).
// O que mudou na troca para o Next:
//   • as buscas eram useEffect + useState; agora são useQuery (useAnuncio,
//     useSemelhantes, useWhatsappConfirmado). Vindo da vitrine, o anúncio já está
//     no cache e a tela abre na hora;
//   • o coração usa o useFavoritos (useQuery + useMutation, com a sessão do Zustand);
//   • a denúncia usa useMutation (FormDenuncia);
//   • navegação com useRouter e next/link. O "Ver mais" dos parecidos escolhe a
//     categoria no Zustand e abre a vitrine, em vez de /vitrine?categoria=.
// Ficou de fora: o "Vistos recentemente" do Perfil (historicoLocal), que não veio do PI.
// =============================================================================

const AVISO_RESPONSABILIDADE =
  'Este anúncio é de responsabilidade de quem publica, inclusive a veracidade e a legalidade da oferta. O ISAC só disponibiliza o espaço e não participa da negociação.'

// A tela inteira.
// Recebe o id do anúncio (a page.jsx lê da rota e passa para cá).
// Devolve a página: carregando, erro, "não encontrado" ou o anúncio.
export default function DetalheAnuncio({ id }) {
  const router = useRouter()
  const { data: anuncio, isPending, isError, refetch } = useAnuncio(id)
  const { estaFavorito, alternarFavorito, erroFavoritos } = useFavoritos()
  const [copia, setCopia] = useState('')

  // Volta para a tela de onde a pessoa veio (a vitrine, com o filtro guardado no Zustand).
  // Se ela abriu o link direto (mandaram pelo WhatsApp), não há tela anterior
  // no site: aí vai para a vitrine, em vez de sair do site.
  // Não recebe argumentos. Não devolve valor.
  function voltar() {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push('/')
  }

  // Compartilha o link ou copia, se o aparelho não tiver a folha de compartilhar.
  // Não recebe argumentos. Não devolve valor.
  async function compartilhar() {
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({ title: anuncio.titulo, url })
      } catch {
        // A pessoa fechou a folha. Não é um erro.
      }
      return
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopia('Link copiado.')
    } catch {
      setCopia('Não foi possível copiar o link.')
    }
  }

  return (
    <>
      {/* Aviso quando o banco não conseguiu salvar o coração. */}
      {erroFavoritos ? (
        <div className="detalhe__aviso" role="status">
          <Alerta tipo="informacao" titulo="Aviso">
            {erroFavoritos}
          </Alerta>
        </div>
      ) : null}

      {isPending ? (
        <main className="detalhe__vazio" aria-busy="true">
          <p>Carregando o anúncio…</p>
        </main>
      ) : isError ? (
        <main className="detalhe__vazio">
          <h1>Não deu para abrir o anúncio</h1>
          <p>Confira a internet e tente de novo.</p>
          <button className="botao botao--primario" type="button" onClick={() => refetch()}>
            Tentar novamente
          </button>
        </main>
      ) : anuncio ? (
        <Conteudo
          key={anuncio.id}
          anuncio={anuncio}
          favorito={estaFavorito(anuncio.id)}
          onFavoritar={() => alternarFavorito(anuncio.id)}
          estaFavorito={estaFavorito}
          onFavoritarOutro={alternarFavorito}
          onVoltar={voltar}
          onCompartilhar={compartilhar}
          copia={copia}
        />
      ) : (
        <main className="detalhe__vazio">
          <h1>Não encontramos esse anúncio</h1>
          <p>Ele pode ter saído do ar ou o link está incompleto.</p>
          <Link href="/">Voltar para a vitrine</Link>
        </main>
      )}
    </>
  )
}

// Miolo do detalhe: foto, preço, quem anunciou, descrição e WhatsApp.
// Recebe o anúncio e as ações do voltar, do compartilhar e do coração.
// Devolve o conteúdo.
function Conteudo({ anuncio, favorito, onFavoritar, estaFavorito, onFavoritarOutro, onVoltar, onCompartilhar, copia }) {
  const categoria = buscarCategoria(anuncio.categoria)
  const preco = formatarPreco(anuncio)
  const link = montarLinkWhatsApp(anuncio.whatsapp, anuncio.titulo)
  const [denunciando, setDenunciando] = useState(false)
  // true / false / null (null = ainda não sabemos: o selo não aparece).
  const { data: whatsappConfirmado = null } = useWhatsappConfirmado(anuncio.autorId)

  // O mesmo botão aparece em dois lugares: junto do preço (computador) e na barra fixa (celular).
  // O CSS esconde um dos dois, então nunca aparecem juntos.
  const botaoWhatsApp = (
    <a className="botao botao--primario detalhe__whatsapp" href={link} target="_blank" rel="noopener noreferrer">
      Chamar no WhatsApp
    </a>
  )

  return (
    <main className="detalhe">
      <div className="detalhe__topo-voltar">
        <button className="detalhe__voltar" type="button" onClick={onVoltar}>
          <IconeVoltar />
          Voltar
        </button>
      </div>

      {/* A coluna da foto tem a mesma altura da coluna de texto (no computador):
          a foto fica presa ao rolar só enquanto o texto passa. */}
      <div className="detalhe__coluna-foto">
        <section className="detalhe__galeria">
          {anuncio.fotos.length ? (
            <GaleriaFotos fotos={anuncio.fotos} titulo={`de ${anuncio.titulo}`} miniaturas />
          ) : (
            <span className={`detalhe__sem-foto detalhe__sem-foto--${categoria.circulo}`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- ícone da categoria */}
              <img src={categoria.icone} alt="" width="72" height="72" />
            </span>
          )}
          <button
            className="detalhe__acao detalhe__acao--compartilhar"
            type="button"
            aria-label="Compartilhar"
            onClick={onCompartilhar}
          >
            <IconeCompartilhar />
          </button>
          <button
            className="detalhe__acao detalhe__acao--favorito"
            type="button"
            aria-pressed={favorito}
            aria-label={favorito ? 'Remover dos salvos' : 'Salvar anúncio'}
            onClick={onFavoritar}
          >
            <IconeCoracao preenchido={favorito} />
          </button>
        </section>
      </div>

      {/* No computador este bloco fica na coluna da direita, ao lado da foto. */}
      <div className="detalhe__texto">
        {copia ? <p className="detalhe__copia">{copia}</p> : null}

        <section className="detalhe__resumo">
          <div className="detalhe__linha">
            <span className={`detalhe__selo detalhe__selo--${categoria.circulo}`}>{categoria.selo}</span>
            {anuncio.destaque ? (
              <span className="detalhe__selo-destaque">
                <IconeEstrela />
                Destaque
              </span>
            ) : null}
            <span className="detalhe__quando">{formatarQuando(anuncio.horasAtras)}</span>
          </div>
          <h1>{anuncio.titulo}</h1>
          <p className="detalhe__preco">
            {preco.principal}
            {preco.sufixo}
          </p>
          <p className="detalhe__meta">
            <IconePino />
            {anuncio.bairro} · {anuncio.cidade}
          </p>
          <p className="detalhe__meta">
            <IconePessoa />
            <span>
              Anunciado por {anuncio.apelido} · {anuncio.bairro}
            </span>
          </p>
          {/* Só aparece quando a equipe já confirmou o WhatsApp de quem anunciou. */}
          {whatsappConfirmado ? (
            <p className="detalhe__selos-autor">
              <SeloWhatsapp />
            </p>
          ) : null}
          {/* Só no computador: o contato fica à vista, junto do preço, sem precisar rolar. */}
          <div className="detalhe__contato-topo">{botaoWhatsApp}</div>
        </section>

        <section className="detalhe__bloco">
          {anuncio.verificado ? (
            <CartaoVerificado anuncio={anuncio} />
          ) : anuncio.origem === 'importado' ? (
            <CartaoGrupo anuncio={anuncio} />
          ) : (
            <CartaoMorador anuncio={anuncio} whatsappConfirmado={whatsappConfirmado} />
          )}
        </section>

        <section className="detalhe__bloco">
          <h2>Descrição</h2>
          <p>{anuncio.descricao}</p>
          <dl className="detalhe__ficha">
            {anuncio.detalhes.map((item) => (
              <div key={item.rotulo}>
                <dt>{item.rotulo}</dt>
                <dd>{item.valor}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="detalhe__bloco detalhe__seguranca">
          <AlertaSeguranca />
          <p className="detalhe__responsabilidade">
            <IconeAviso />
            <span>{AVISO_RESPONSABILIDADE}</span>
          </p>
          {denunciando ? (
            <FormDenuncia anuncioId={anuncio.id} onFechar={() => setDenunciando(false)} />
          ) : (
            <button className="detalhe__denunciar" type="button" onClick={() => setDenunciando(true)}>
              <IconeBandeira />
              Denunciar anúncio
            </button>
          )}
        </section>
      </div>

      <Semelhantes anuncio={anuncio} estaFavorito={estaFavorito} onFavoritar={onFavoritarOutro} />

      {/* Barra fixa do celular: preço + WhatsApp sempre à mão. */}
      <section className="detalhe__contato">
        <p>
          <span>Preço</span>
          <strong>
            {preco.principal}
            {preco.sufixo}
          </strong>
        </p>
        {botaoWhatsApp}
      </section>
    </main>
  )
}

// Seção "Você também pode gostar" no fim do detalhe: mesma categoria, mesmo bairro primeiro.
// Se não houver nenhum (ou der erro), some sem barulho: a pessoa não pediu isso
// e o anúncio principal continua completo.
// Recebe o anúncio aberto, a função que diz se um id está salvo e a função do coração.
// Devolve a seção, ou nada.
function Semelhantes({ anuncio, estaFavorito, onFavoritar }) {
  const { data: lista = [] } = useSemelhantes(anuncio)
  const escolherCategoria = useFiltrosStore((estado) => estado.escolherCategoria)
  const mudarBusca = useFiltrosStore((estado) => estado.mudarBusca)

  if (lista.length === 0) {
    return null
  }

  return (
    <section className="detalhe__semelhantes" aria-labelledby="titulo-semelhantes">
      <div className="detalhe__semelhantes-topo">
        <h2 id="titulo-semelhantes">Você também pode gostar</h2>
        {/* "Ver mais" deixa a vitrine filtrada nesta categoria (filtro no Zustand). */}
        <Link
          className="detalhe__semelhantes-ver"
          href="/"
          onClick={() => {
            mudarBusca('')
            escolherCategoria(anuncio.categoria)
          }}
        >
          Ver mais
        </Link>
      </div>
      <div className="detalhe__semelhantes-lista">
        {lista.map((outro) => (
          <CardAnuncio key={outro.id} anuncio={outro} favorito={estaFavorito(outro.id)} onFavoritar={onFavoritar} />
        ))}
      </div>
    </section>
  )
}

// Cartão do morador que publicou direto no app (não é comércio verificado nem veio do grupo).
// Diz com clareza o que o ISAC conferiu e o que não.
// Recebe o anúncio e o sim/não do WhatsApp (null = não sabemos, aí não afirma nada).
// Devolve o cartão.
function CartaoMorador({ anuncio, whatsappConfirmado }) {
  return (
    <article className="detalhe__cartao">
      <Avatar nome={anuncio.nomeAnunciante} foto="" className="detalhe__marca detalhe__marca--grupo" />
      <div>
        <h2>{anuncio.nomeAnunciante}</h2>
        <p>Morador do bairro. Ainda não é um comércio verificado pelo ISAC.</p>
        <p>
          {whatsappConfirmado
            ? 'A equipe do ISAC confirmou que o WhatsApp é desta pessoa e revisou este anúncio antes de ele aparecer.'
            : 'A equipe do ISAC revisou este anúncio antes de ele aparecer.'}
        </p>
      </div>
    </article>
  )
}

// Cartão de quem veio do grupo do bairro e ainda não é verificado.
// Recebe o anúncio. Devolve o cartão.
function CartaoGrupo({ anuncio }) {
  return (
    <article className="detalhe__cartao">
      <span className="detalhe__marca detalhe__marca--grupo" aria-hidden="true">
        <IconePessoa />
      </span>
      <div>
        <h2>Do grupo do bairro</h2>
        <p>{anuncio.textoOrigem}</p>
      </div>
    </article>
  )
}

// Cartão do comércio que o ISAC já conhece.
// Recebe o anúncio. Devolve o cartão com o selo "Anunciante verificado".
function CartaoVerificado({ anuncio }) {
  return (
    <article className="detalhe__cartao">
      <Avatar
        nome={anuncio.nomeAnunciante}
        foto={anuncio.fotoAnunciante}
        className="detalhe__marca detalhe__marca--verificado"
      />
      <div>
        <div className="detalhe__nome">
          <h2>{anuncio.nomeAnunciante}</h2>
          <span className="detalhe__selo-verificado">
            <IconeVerificado />
            Anunciante verificado
          </span>
        </div>
        <p>Comércio verificado pelo ISAC desde {anuncio.desde}.</p>
        <p>O selo mostra que o ISAC conhece quem anuncia. Não garante o produto ou o serviço.</p>
      </div>
    </article>
  )
}
