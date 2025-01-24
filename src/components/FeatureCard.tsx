import React from 'react'
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/react'
import './FeatureCard.css'
import idcard from '../assets/idcard.svg'
import grades from '../assets/grades.svg'
import schedule from '../assets/schedule.svg'
const FeatureCard: React.FC = () => {
  return (
    <div className="FeatureCard">
      <div className="left-card">
        <div className="card-container">
          <div className="floating-image">
            <img alt="icon" src={idcard} />
          </div>
          <IonCard className="idcard">
            <div className="text-container">
              <IonCardHeader>
                <IonCardTitle>电子校园卡</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>二维码支持付款、充值等</IonCardContent>
            </div>
          </IonCard>
        </div>
      </div>
      <div className="right-cards">
        <IonCard button routerLink="/schedule" className="small-card">
          <div className="card-content">
            <div className="icon-container">
              <img alt="icon" src={schedule} />
            </div>
            <div className="text-container">
              <IonCardTitle>学期课表</IonCardTitle>
              <IonCardContent>各学期课表信息</IonCardContent>
            </div>
          </div>
        </IonCard>

        <IonCard button routerLink="/grades" className="small-card">
          <div className="card-content">
            <div className="icon-container">
              <img alt="icon" src={grades} />
            </div>
            <div className="text-container">
              <IonCardTitle>学业绩点</IonCardTitle>
              <IonCardContent>各科成绩绩点</IonCardContent>
            </div>
          </div>
        </IonCard>
      </div>
    </div>
  )

}

export default FeatureCard