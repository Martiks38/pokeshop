import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import useShopping from 'hooks/useShopping'
import SearchForm from 'components/SearchForm'

function Header() {
  const [viewSearchHeader, setviewSearchHeader] = useState(false)
  const [viewUserMenu, setViewUserMenu] = useState(false)
  const { state, toggleLog } = useShopping()

  const numberItems = state.products.reduce(
    (prevValue, currentValue) => {
      return {
        quantity: prevValue.quantity + currentValue.quantity,
      }
    },
    { quantity: 0 }
  ).quantity

  const handleViewSearchHeader = useCallback(() => {
    const isNarrow = window.innerWidth < 550
    const outHome = window.location.pathname !== '/'
    const $headerWrapper = document.querySelector('.header__wrapper')

    if (outHome && !isNarrow) {
      setviewSearchHeader(true)
      $headerWrapper.classList.remove('header__wrapper_right')
      return
    }

    setviewSearchHeader(false)
    $headerWrapper.classList.add('header__wrapper_right')
    return
  }, [])

  const handleToggleUserMenu = () => {
    setViewUserMenu(!viewUserMenu)
  }

  useEffect(() => {
    handleViewSearchHeader()

    window.addEventListener('resize', handleViewSearchHeader)

    return () => window.removeEventListener('resize', handleViewSearchHeader)
  }, [handleViewSearchHeader])

  return (
    <header className="header">
      <Link href="/">
        <a className="logo">
          <Image
            src="/eevee.webp"
            alt="pokeshop"
            layout="fixed"
            width={32}
            height={32}
          />
        </a>
      </Link>
      <div className="header__wrapper">
        {viewSearchHeader && <SearchForm inHeader />}
        <div className="wrapper__user">
          <button className="userCart">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              focusable="false"
              viewBox="0 0 12 12"
            >
              <path
                fill="#fdfdfd"
                d="M4.55 9.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zm5.2 0a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zm-5.2 1a.25.25 0 100 .5.25.25 0 000-.5zm5.2 0a.25.25 0 100 .5.25.25 0 000-.5zM11 1a1 1 0 01.94 1.341l-.046.106-2 4a1 1 0 01-.77.545L9 7H5a1 1 0 01-.182-.017L4.309 8H10.5a.5.5 0 01.09.992L10.5 9H4.309a1 1 0 01-.94-1.34l.046-.107.621-1.244-1.93-3.862a1.034 1.034 0 01-.05-.116L1.39 1H.5A.5.5 0 01.008.59L0 .5A.5.5 0 01.41.008L.5 0h1.2a.5.5 0 01.398.197l.05.08.361.723H11zm0 1H3.009l1.938 3.876.033.084L5 6h4l2-4z"
              />
            </svg>
            {numberItems !== 0 && (
              <span
                className={
                  numberItems < 10
                    ? 'userCart__numberItems'
                    : numberItems < 100
                    ? 'userCart__numberItems userCart__numberItems_twoDig'
                    : 'userCart__numberItems userCart__numberItems_threeDig'
                }
              >
                {numberItems}
              </span>
            )}
          </button>
          <button className="userIcon" onClick={handleToggleUserMenu}>
            <img
              src="/userIcon.webp"
              alt="profile image"
              className="userIcon__img"
            />
          </button>
          {viewUserMenu && (
            <div className="userMenu">
              {state.isConnected ? (
                <Link href="/login">
                  <a className="userMenu__item" onClick={handleToggleUserMenu}>
                    Log In
                  </a>
                </Link>
              ) : (
                <button className="userMenu__item" onClick={toggleLog}>
                  Log Out
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
