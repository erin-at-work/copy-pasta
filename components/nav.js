import Link from 'next/link'

const homeLink = `
  inline-block border border-blue-500
  rounded py-2 px-4 bg-blue-500 hover:bg-blue-700
  text-white
`;

const Nav = () => (
  <nav>
    <ul className="flex p-3">
      <li className="mr-6">
        <Link href="/">
          <a className={homeLink}>Home</a>
        </Link>
      </li>
    </ul>
  </nav>
)

export default Nav
