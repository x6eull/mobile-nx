import './Study.css'
import { useRef } from 'react'

import {
  IonButton,
  IonHeader,
  IonToolbar,
  IonModal,
  IonButtons,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSegmentView,
  IonSegmentContent,
  IonInput,
  IonList,
  IonItem,
  IonToggle,
  IonDatetime,
  IonDatetimeButton,
  IonIcon,
  IonTextarea,
} from '@ionic/react'
import { closeOutline } from 'ionicons/icons'

export default function Study() {
  const modal = useRef<HTMLIonModalElement>(null)
  function dismiss() {
    modal.current?.dismiss()
  }
  return (
    <>
      <IonButton
        className="fab-buttun-study"
        shape="round"
        id="open-modal"
        expand="block"
        size="small"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 3.00001V3.00001C19.6569 3.00001 21 4.34315 21 6.00001L21 8.14286C21 8.47698 21 8.64405 20.9234 8.76602C20.8834 8.82962 20.8296 8.8834 20.766 8.92336C20.644 9 20.477 9 20.1429 9L15 9M18 3.00001V3.00001C16.3431 3.00001 15 4.34315 15 6.00001L15 9M18 3.00001L7 3.00001C5.11438 3.00001 4.17157 3.00001 3.58579 3.58579C3 4.17158 3 5.11439 3 7.00001L3 21L6 20L9 21L12 20L15 21L15 9"
            stroke="#FF5E72"
            stroke-width="2"
          />
          <path
            d="M7 7L11 7"
            stroke="#FF5E72"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M8 11H7"
            stroke="#FF5E72"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M7 15L10 15"
            stroke="#FF5E72"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </IonButton>

      <IonModal
        className="schedule-modal-study"
        ref={modal}
        trigger="open-modal"
        initialBreakpoint={1}
        breakpoints={[0, 1]}
      >
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <div className="bar">
              <div className="title">
                <div className="icon-calendar">
                  <svg
                    width="33"
                    height="33"
                    viewBox="0 0 33 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      width="33"
                      height="33"
                      rx="10"
                      fill="#FF5E72"
                      fill-opacity="0.2"
                    />
                    <path
                      d="M23 8.00001V8.00001C24.6569 8.00001 26 9.34315 26 11L26 13.1429C26 13.477 26 13.644 25.9234 13.766C25.8834 13.8296 25.8296 13.8834 25.766 13.9234C25.644 14 25.477 14 25.1429 14L20 14M23 8.00001V8.00001C21.3431 8.00001 20 9.34315 20 11L20 14M23 8.00001L12 8.00001C10.1144 8.00001 9.17157 8.00001 8.58579 8.58579C8 9.17158 8 10.1144 8 12L8 26L11 25L14 26L17 25L20 26L20 14"
                      stroke="#FF5E72"
                      stroke-width="2"
                    />
                    <path
                      d="M12 12L16 12"
                      stroke="#FF5E72"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                    <path
                      d="M13 16H12"
                      stroke="#FF5E72"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                    <path
                      d="M12 20L15 20"
                      stroke="#FF5E72"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
                <div className="icon-label">
                  <IonLabel>课程</IonLabel>
                </div>
              </div>
              <IonButtons>
                <IonButton className="editor" size="large">
                  <IonLabel>编辑</IonLabel>
                </IonButton>
                <IonButton
                  className="close"
                  size="small"
                  onClick={() => dismiss()}
                >
                  <IonIcon icon={closeOutline} size="large"></IonIcon>
                </IonButton>
              </IonButtons>
            </div>
          </IonToolbar>
        </IonHeader>

        <div className="content">
          <IonList inset={false} lines="full" mode="md">
            <IonItem className="custom-input-item">
              <IonInput placeholder="课程名称" mode="ios"></IonInput>
            </IonItem>
          </IonList>
          <IonList inset={true} lines="inset" mode="ios" className="solid">
            <IonItem>
              <IonLabel className="left">时间</IonLabel>
              <IonDatetimeButton datetime="course-time"></IonDatetimeButton>
              <IonModal keepContentsMounted={true}>
                <IonDatetime
                  id="course-time"
                  presentation="date-time"
                  formatOptions={{
                    date: {
                      month: 'long',
                      day: '2-digit',
                    },
                    time: {
                      hour: '2-digit',
                      minute: '2-digit',
                    },
                  }}
                ></IonDatetime>
              </IonModal>
            </IonItem>
            <IonItem>
              <IonLabel className="left">地点</IonLabel>
              <IonLabel class="right">东2-201</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel className="left">教师</IonLabel>
              <IonLabel class="right">苏德矿</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel className="left">学期</IonLabel>
              <IonLabel class="right">25年 春夏</IonLabel>
            </IonItem>
          </IonList>
          <IonList inset={true} lines="inset" mode="ios" className="solid">
            <IonItem>
              <IonLabel className="left">备注</IonLabel>
            </IonItem>
            <IonItem>
              <IonTextarea
                autoGrow={true}
                placeholder="可添加成绩构成等课程说明"
              ></IonTextarea>
            </IonItem>
          </IonList>
        </div>
      </IonModal>
    </>
  )
}

