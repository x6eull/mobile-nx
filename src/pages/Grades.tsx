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
} from '@ionic/react'
import { close, barChartOutline } from 'ionicons/icons'
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
          <IonButtons slot="start">
            <IonIcon icon={barChartOutline} size="large" />
          </IonButtons>
          <IonTitle>绩点</IonTitle>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon icon={close} size="large" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="grades-content">
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
