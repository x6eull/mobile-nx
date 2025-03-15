import React from 'react'
import { IonButton, IonImg } from '@ionic/react'
import eye from '../../assets/kbheader-eye.png'
import out from '../../assets/kbheader-out.png'
import './CourseScheduleHeader.css'

interface CourseScheduleHeaderProps {
  creditHours: number
  isTextVisible: boolean
  onTextVisibilityChange: (visible: boolean) => void
}

const CourseScheduleHeader: React.FC<CourseScheduleHeaderProps> = ({
  creditHours,
  isTextVisible,
  onTextVisibilityChange,
}) => {
  const handleEyeClick = () => {
    onTextVisibilityChange(!isTextVisible)
  }

  return (
    <div className="schedule-header">
      <div className="credit-info">
        <span className="credit-label">学期学时</span>
        <span className="credit-value">{creditHours}</span>
      </div>
      <div className="action-buttons">
        <IonButton fill="clear" size="small" onClick={handleEyeClick}>
          <IonImg src={eye} alt="eye" />
        </IonButton>
        <IonButton fill="clear" size="small">
          <IonImg src={out} alt="Out" />
        </IonButton>
      </div>
    </div>
  )
}

export default CourseScheduleHeader
