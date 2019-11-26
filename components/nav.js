import Link from 'next/link'

const homeLink = `
  py-2 px-4
  text-lg
  text-center
`;

const Nav = () => (
  <nav>
    <ul className="flex p-5 justify-center">
      <li className="block">
        <Link href="/">
          <a className={homeLink}>✂️🍝</a>
        </Link>
      </li>
    </ul>
  </nav>
)

export default Nav
