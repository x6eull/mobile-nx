import './Index.scss'
import { useContext } from 'react'
import { versionContext } from '../App'

export default function Index() {
  const { frontend, capa, newVersion } = useContext(versionContext)
  return <div className='index'>
    <div className='cover'>
      <ul className='debug-info'>
        <li>frontend@{frontend}</li>
        <li>capa@{capa}</li>
        {newVersion ? <li>frontend@{newVersion} is ready</li> : null}
      </ul>
      <div className='logo'>MOBILE nx</div>
    </div>
  </div>
}