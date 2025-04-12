import React from 'react'
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/react'
import './SemesterSelector.css'
import { Semester, Term } from '../../../models/shared'

const SemesterList: Semester[] = [
  { year: 2024, term: Term.Autumn },
  { year: 2023, term: Term.Summer },
  { year: 2023, term: Term.Spring },
  { year: 2023, term: Term.Winter },
  { year: 2023, term: Term.Autumn },
]

const SemesterSelector: React.FC<{
  selected: string
  onChange: (value: string) => void
}> = ({ selected, onChange }) => {
  return (
    <IonSegment
      value={selected}
      onIonChange={(e) => onChange(e.detail.value as string)}
      className='semester-selector'
      scrollable={true}
    >
      {SemesterList.map((semester) => {
        // 组合年份和学期作为key
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
            className='semester-selector-button'
          >
            <IonLabel>{label}</IonLabel>
          </IonSegmentButton>
        )
      })}
    </IonSegment>
  )
}

export default SemesterSelector
