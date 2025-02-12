"use client"
import React, { useState } from 'react'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonFooter,
  IonItem,
  IonRouterLink,
  IonImg,
  IonLabel,
} from '@ionic/react'
import { close } from 'ionicons/icons'
import jdleft from '../assets/jdleft.png'
import GradesSummary from '../components/GradesPage/GradesSummary'
import SemesterSummary from '../components/GradesPage/SemesterSummary'
import CourseList from '../components/GradesPage/CourseList'
import SemesterSelector from '../components/GradesPage/SemesterSelector'
import './Grades.css'

const Grades: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState('2018-fall')

  return (
    <IonPage className="grades-page">
      <IonHeader>
        <IonToolbar>
          <div className="header-content">
          <IonImg src={jdleft} alt="JD Left" slot="start" className="jdleft-img"/>
          <IonLabel className="grades-title" >绩点</IonLabel>
          </div>
          <IonButtons slot="end">
            <IonRouterLink routerLink="/profile">
              <IonButton>
                <IonIcon icon={close} size="large" />
              </IonButton>
            </IonRouterLink>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="grades-content" scrollY={true}>
        <div className="grades-container">
          <GradesSummary />
          <SemesterSummary />
          <CourseList />
        </div>
      </IonContent>

      <IonFooter className="ion-no-border grades-footer">
        <SemesterSelector
          selected={selectedSemester}
          onChange={setSelectedSemester}
        />
      </IonFooter>
    </IonPage>
  )
}

export default Grades
