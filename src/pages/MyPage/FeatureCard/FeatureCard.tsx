import React from 'react'
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/react'
import './FeatureCard.css'
import grades from '../grades.svg'
import schedule from '../schedule.svg'

const FeatureCard: React.FC = () => {
  return (
    <div className="FeatureCard">
      {/* 左侧组件 */}
      <div className="left-component">
        <IonCard
          button
          routerLink="/profile/course-schedule"
          className="small-card"
        >
          <div className="card-content">
            <div className="icon-container">
              <img alt="icon" src={schedule} />
            </div>
            <div className="text-container">
              <IonCardTitle className="text-title">学期课表</IonCardTitle>
              {/* <IonCardContent>各学期课表信息</IonCardContent> */}
            </div>
          </div>
        </IonCard>
      </div>

      {/* 右侧组件 */}
      <div className="right-component">
        <IonCard button routerLink="/profile/grades" className="small-card">
          <div className="card-content">
            <div className="icon-container">
              <img alt="icon" src={grades} />
            </div>
            <div className="text-container">
              <IonCardTitle className="text-title">学业绩点</IonCardTitle>
              {/* <IonCardContent>各科成绩绩点</IonCardContent> */}
            </div>
          </div>
        </IonCard>
      </div>
    </div>
  )
}

export default FeatureCard
