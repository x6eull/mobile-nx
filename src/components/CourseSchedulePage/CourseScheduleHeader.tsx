import React, { useState } from 'react'
import { IonButton, IonImg } from '@ionic/react'
import eye from '../../assets/kbheader-eye.png'
import out from '../../assets/kbheader-out.png'
import './CourseScheduleHeader.css'

// 创建一个全局事件总线来传递显示状态
export const courseTextVisibilityEvent = new EventTarget()

const CourseScheduleHeader: React.FC = () => {
  const [isTextVisible, setIsTextVisible] = useState(true)

  const handleEyeClick = () => {
    const newVisibility = !isTextVisible
    setIsTextVisible(newVisibility)

    // 发送自定义事件通知其他组件
    const event = new CustomEvent('courseTextVisibilityChange', {
      detail: { isVisible: newVisibility },
    })
    courseTextVisibilityEvent.dispatchEvent(event)
  }

  return (
    <div className="schedule-header">
      <div className="credit-info">
        <span className="credit-label">学期学时</span>
        <span className="credit-value">43.0</span>
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
