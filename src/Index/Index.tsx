import './Index.scss'
import { useContext } from 'react'
import { versionContext } from '../App'
import { useNavigate } from 'react-router-dom'

export default function Index() {
  const navigate = useNavigate()
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
    <button onClick={() => navigate('/detail/test', { replace: false })}>Click here to open a new subpage</button>
    <button onClick={() => {
      //TODO DEBUG only
      const result = prompt('Please input js to eval\nWARNING: DEBUG only.')
      if (!result) return
      alert(JSON.stringify(eval(result ?? '')))
    }}>Click here to eval</button>
  </div>
}