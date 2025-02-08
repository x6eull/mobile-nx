import React,{useEffect,useRef} from 'react'
import {  IonCheckbox } from '@ionic/react'

const TermsCheckbox: React.FC<{
  isChecked: boolean
  setIsChecked: (value: boolean) => void
}> = ({ isChecked, setIsChecked }) => {
  const ref = useRef<HTMLAnchorElement>(null)
   useEffect(() => {
     ref.current?.addEventListener('click', (event) => {
       event.stopPropagation()
     })
   }, [ref])
  return (
    <IonCheckbox
      labelPlacement="end"
      checked={isChecked}
      onIonChange={(e) => setIsChecked(e.detail.checked)}
    >
      同意{' '}
      <a href="/terms" ref={ref}>
        免责声明、隐私政策等服务条款
      </a>
    </IonCheckbox>
  )
}

export default TermsCheckbox
