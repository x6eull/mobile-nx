import React from 'react'
import { IonCard, IonCardContent } from '@ionic/react'
import './SemesterSummary.css'

const SemesterSummary: React.FC = () => {
  return (
    <div className="semester-summary">
      <div className="summary-row">
        <div className="summary-item">
          <div className="item-value">30.0</div>
          <div className="item-label">学期学分</div>
        </div>
        <div className="summary-item">
          <div className="item-value">4.80</div>
          <div className="item-label">学期均绩</div>
        </div>
        <div className="summary-item">
          <div className="item-value">64.5</div>
          <div className="item-label">学年学分</div>
        </div>
        <div className="summary-item">
          <div className="item-value">4.80</div>
          <div className="item-label">学年均绩</div>
        </div>
      </div>
    </div>
  )
}

export default SemesterSummary
