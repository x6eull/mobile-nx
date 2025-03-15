import React from 'react'
import { IonButton, IonImg, useIonToast } from '@ionic/react'
import eye from '../../assets/kbheader-eye.png'
import out from '../../assets/kbheader-out.png'
import toast from '../../assets/toast.jpg'

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
  const [present] = useIonToast()

  const handleEyeClick = () => {
    onTextVisibilityChange(!isTextVisible)
  }

  const showToast = (success: boolean) => {
    present({
      message: success ? '保存图片成功！' : '保存图片失败！',
      duration: 2000,
      position: 'top',
      cssClass: 'custom-toast',
      image: toast,
    })
  }

  const handleSaveClick = () => {
    try {
      // 这里添加保存图片的逻辑
      // ...

      // 成功后显示成功提示
      showToast(true)
    } catch (error) {
      showToast(false)
      console.error('保存失败:', error)
    }
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
        <IonButton fill="clear" size="small" onClick={handleSaveClick}>
          <IonImg src={out} alt="Out" />
        </IonButton>
      </div>
    </div>
  )
}

export default CourseScheduleHeader
