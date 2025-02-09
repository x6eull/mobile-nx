import React from 'react'
import { IonCard, IonCardContent, IonGrid, IonRow, IonCol } from '@ionic/react'
import './GradesSummary.css'

const GradesSummary: React.FC = () => {
  return (
    <div className="grades-summary">
      <div className="summary-row">
        <div className="summary-item">
          <div className="item-value">123.0</div>
          <div className="item-label">总学分</div>
        </div>
        <div className="summary-item">
          <div className="item-value">4.33</div>
          <div className="item-label">总均绩</div>
        </div>
        <div className="summary-item">
          <div className="item-value">3.83</div>
          <div className="item-label">4.3分制</div>
        </div>
        <div className="summary-item">
          <div className="item-value">87.7</div>
          <div className="item-label">百分制</div>
        </div>
      </div>
      <div className="update-time">
        上次更新时间：2025-1-15 16:01:02
      </div>
    </div>
  )
}

export default GradesSummary
