'use client'
import React, { useState } from 'react'
import {
  IonPage,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonRouterLink,
  IonImg,
  IonLabel,
} from '@ionic/react'
import { close } from 'ionicons/icons'
import jd from '../../assets/Search.svg'
import GradesSummary from './Summary/GradesSummary'
import SemesterSummary from './Summary/SemesterSummary'
import CourseList from './List/CourseList'
import SemesterSelector from './Semester/SemesterSelector'
import './Grades.css'

const Grades: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState('2018-fall')

  return (
    <IonPage className="grades-page">
      <IonToolbar>
        <div className="header-content">
          <IonImg
            src={jd}
            alt="JD "
            slot="start"
            className="jd-img"
          />
          <IonLabel className="grades-title">绩点</IonLabel>
        </div>
        <IonButtons slot="end">
          <IonRouterLink routerLink="/profile">
            <IonButton>
              <IonIcon icon={close} size="large" />
            </IonButton>
          </IonRouterLink>
        </IonButtons>
      </IonToolbar>

      <IonContent fullscreen className="grades-content" scrollY={true}>
        <div className="grades-container">
          <GradesSummary />
          <SemesterSummary />
          <CourseList />
          <SemesterSelector
            selected={selectedSemester}
            onChange={setSelectedSemester}
          />
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Grades
