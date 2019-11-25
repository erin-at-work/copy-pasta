import Link from 'next/link'

const links = [
  { href: 'https://zeit.co/now', label: 'ZEIT' },
  { href: 'https://github.com/zeit/next.js', label: 'GitHub' },
].map(link => {
  link.key = `nav-link-${link.href}-${link.label}`
  return link
})

const homeLink = `
  inline-block border border-blue-500
  rounded py-2 px-4 bg-blue-500 hover:bg-blue-700
  text-white
`;

const linkClasses = `
  inline-block border border-white rounded
  hover:border-gray-200 text-blue-500 hover:bg-gray-200
  py-2 px-4 mr-6
`;

const Nav = () => (
  <nav>
    <ul className="flex p-3">
      <li className="mr-6">
        <Link href="/">
          <a className={homeLink}>Home</a>
        </Link>
      </li>
      {links.map(({ key, href, label }) => (
        <li key={key}>
          <a href={href} className={linkClasses}>{label}</a>
        </li>
      ))}
    </ul>
  </nav>
)

export default Nav
