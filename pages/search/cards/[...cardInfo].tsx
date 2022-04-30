import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import CardItem from 'components/CardItem'
import NavPanelBtn from 'components/NavPanelBtn'
import SearchForm from 'components/SearchForm'
import getCardPrice from 'services/getCardPrice'
import getCards from 'services/getCards'
import { typeHover } from 'consts/cardType'
import { apiUrl } from 'consts/configUrl'
import { CardV2 } from 'interface/cardMarket'

const pageSize = 25 // Number of cards per page

export default function SearchCardName(props: { cards: CardV2[] }) {
  const [viewSearch, setViewSearch] = useState(false)

  const { cards } = props

  const handleViewSearch = useCallback(() => {
    const isNarrow = window.innerWidth < 550

    isNarrow ? setViewSearch(true) : setViewSearch(false)
  }, [])

  useEffect(() => {
    handleViewSearch()

    window.addEventListener('resize', handleViewSearch)

    return () => window.removeEventListener('resize', handleViewSearch)
  }, [handleViewSearch])

  if (useRouter().isFallback) return <h1>Loading...</h1>
  return (
    <div className="resultsSearch">
      {viewSearch && (
        <div className="resultsSearch__form">
          <SearchForm />
        </div>
      )}
      <div className="resultsSearch__results">
        {cards.map((card, index) => (
          <CardItem
            key={card.id}
            alt={card.name}
            id={card.id}
            loading={index < 10 ? 'eager' : 'lazy'}
            price={getCardPrice(card, 'USD')}
            route={`/search/card/${
              encodeURI(card.name) + '-' + encodeURI(card.set.name)
            }/${card.id}`}
            src={card.images.small}
            style={
              card.supertype === 'Pokémon'
                ? typeHover.Pokemon[card.types[0]]
                : typeHover[card.supertype]
            }
            styleCard="card"
          />
        ))}
      </div>
      <NavPanelBtn isEnd={cards.length < pageSize} pathname="/search/cards" />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const pokemons = [
    'lucario',
    'mimikyu',
    'umbreon',
    'sylveon',
    'pikachu',
    'eevee',
  ]

  const paths = pokemons.map((pokemon) => {
    return {
      params: {
        cardInfo: [pokemon, '1'],
      },
    }
  })

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const [name, page] = context.params.cardInfo
  const numberPage = page ?? 1

  const paramsV2 = `?q=name:${name}&page=${numberPage}&pageSize=${pageSize}`
  const url = `${apiUrl}/cards${paramsV2}`

  const cards = await Promise.resolve(getCards(url))

  return {
    props: {
      cards,
    },
  }
}
