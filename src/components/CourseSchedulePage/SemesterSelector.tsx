import React from 'react'
import {
  IonSegment,
  IonSegmentButton,
  IonLabel
} from '@ionic/react'
import './SemesterSelector.css'
import { Semester, Term } from '../../models/shared'

interface SemesterSelectorProps {
  semesterList: Semester[]
  selected: string
  onChange: (value: string) => void
}

const SemesterSelector: React.FC<SemesterSelectorProps> = ({
  semesterList,
  selected,
  onChange
}) => {
  return (
    <IonSegment
      value={selected}
      onIonChange={(e) => onChange(e.detail.value as string)}
      className="semester-selector"
      scrollable={true}
    >
      {semesterList.map((semester) => {
        const semesterKey = `${semester.year}-${Term[semester.term]}`
        const label = `${semester.year} ${
          semester.term === Term.Autumn
            ? '秋'
            : semester.term === Term.Summer
              ? '夏'
              : semester.term === Term.Spring
                ? '春'
                : '冬'
        }`

        return (
          <IonSegmentButton
            key={semesterKey}
            value={semesterKey}
            contentId={semesterKey}
            className="semester-selector-button"
          >
            <IonLabel>{label}</IonLabel>
          </IonSegmentButton>
        )
      })}
    </IonSegment>
  )
}

export default SemesterSelector
