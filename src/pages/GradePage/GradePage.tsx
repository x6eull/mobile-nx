import { useState } from 'react'
import { IonPage } from '@ionic/react'
import IconGrade from './iconGrade.svg?react'
import GradeSummary from './GradeSummary/GradeSummary'
import SemesterGrade from './SemesterGrade/SemesterGrade'
import './GradePage.css'
import { Term } from '@/models/shared'
import Toolbar from '@/components/Toolbar/Toolbar'
import SemesterSegment from '@/components/SemesterSegment/SemesterSegment'

export default function GradePage() {
  //TODO 传实际数据
  const [selectedSemester, setSelectedSemester] = useState(
    `2023-` + Term.Autumn,
  )

  return (
    <IonPage className='grade-page no-app-nav'>
      <Toolbar
        icon={<IconGrade className='icon-grade' />}
        title='成绩'
        backLink='/mine'
      />
      <GradeSummary
        credits='123.9'
        gpa5='1.23'
        gpa4_3='2.34'
        gpa100='34.5'
        lastUpdated='2023-10-01 12:00:00'
      />
      <SemesterGrade
        credits='22.5'
        gpa='1.23'
        creditsYear='41'
        gpaYear='1.23'
        courses={Array.from({ length: 100 }, (_, index) => ({
          name: '高等数学' + index,
          credit: 4,
          id: index.toString(),
          rawScore: '90',
          rawGradePoint: '4.0',
          semester: { year: 2023, term: Term.Autumn },
          isAborted: false,
        }))}
      />
      <SemesterSegment
        value={selectedSemester}
        onChange={setSelectedSemester}
        items={[
          { label: '2023-秋', value: '2023-' + Term.Autumn },
          { label: '2023-春', value: '2023-' + Term.Spring },
          { label: '2023-夏', value: '2023-' + Term.Summer },
          { label: '2024-夏', value: '2024-' + Term.Summer },
          { label: '2025-夏', value: '2025-' + Term.Summer },
          { label: '2026-夏', value: '2026-' + Term.Summer },
          { label: '2027-夏', value: '2027-' + Term.Summer },
          { label: '2028-夏', value: '2028-' + Term.Summer },
          { label: '2029-夏', value: '2029-' + Term.Summer },
          { label: '2030-夏', value: '2030-' + Term.Summer },
        ]}
      />
    </IonPage>
  )
}
