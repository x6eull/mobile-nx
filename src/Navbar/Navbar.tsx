import { NavLink } from 'react-router-dom'
import './Navbar.scss'

const paths = ['/index', '/calendar', '/setting']
export default function Navbar() {
  return (<nav className="navbar">
    {paths.map(p => <NavLink replace key={p} to={p} className={({ isActive }) => 'link' + (isActive ? ' active' : '')}>{p}</NavLink>)}
  </nav>)
}