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
} from '@ionic/react'
import { close, barChartOutline } from 'ionicons/icons'
import GradesSummary from '../components/GradesPage/GradesSummary.tsx'
import SemesterSummary from '../components/GradesPage/SemesterSummary.tsx'
import CourseList from '../components/GradesPage/CourseList.tsx'
import SemesterSelector from '../components/GradesPage/SemesterSelector.tsx'
const Grades: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [selectedSemester, setSelectedSemester] = useState('2018-2019-1')
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonIcon icon={barChartOutline} size="large" />
          </IonButtons>
          <IonTitle>成绩</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon icon={close} size="large" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <GradesSummary />
        <SemesterSummary />
        <CourseList />
        <SemesterSelector
          selected={selectedSemester}
          onChange={setSelectedSemester}
        />
      </IonContent>
    </IonPage>
  )
}

export default Grades
