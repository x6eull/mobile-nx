import React, { useState } from 'react'
import { IonButton, IonImg, IonToast } from '@ionic/react'
import eye from '../../../assets/kbheader-eye.png'
import out from '../../../assets/kbheader-out.png'
import toast from '../../../assets/toast.jpg'


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
  const [showToast, setShowToast] = useState(false)
  const [isSuccess, setIsSuccess] = useState(true)

  const handleEyeClick = () => {
    onTextVisibilityChange(!isTextVisible)
  }

  const handleSaveClick = async () => {
    try {//保存图片AI写了一段，具体的url应该要之后再修改
      // 获取要截图的元素
      const element = document.getElementById('semesterKey')
      if (!element) {
        throw new Error('找不到要截图的元素')
      }

      // 创建一个 canvas 元素
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) {
        throw new Error('无法创建 canvas 上下文')
      }

      // 设置 canvas 尺寸
      const { width, height } = element.getBoundingClientRect()
      canvas.width = width * 2 
      canvas.height = height * 2

      // 设置缩放以提高清晰度
      context.scale(2, 2)

      // 绘制背景
      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, width, height)

      // 将 HTML 转换为图片并绘制到 canvas
      const data = new XMLSerializer().serializeToString(element)
      const img = new Image()
      const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)

      img.onload = () => {
        context.drawImage(img, 0, 0, width, height)
        URL.revokeObjectURL(url)

        // 转换为图片并下载
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.download = `课表_${new Date().toLocaleDateString()}.png`
            link.href = url
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
            setIsSuccess(true)
            setShowToast(true)
          } else {
            throw new Error('无法创建图片')
          }
        }, 'image/png')
      }

      img.onerror = () => {
        throw new Error('图片加载失败')
      }

      img.src = url
    } catch (error) {
      console.error('保存失败:', error)
      setIsSuccess(false)
      setShowToast(true)
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

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={isSuccess ? '保存图片成功！' : '保存图片失败！'}
        duration={2000}
        position="top"
        cssClass="custom-toast"
        icon={toast} //似乎没有image属性，图片插入无法显示
      />
    </div>
  )
}

export default CourseScheduleHeader
