import './Daily.css'
import { useRef } from 'react'

import {
  IonButton,
  IonHeader,
  IonToolbar,
  IonModal,
  IonButtons,
  IonLabel,
  IonInput,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonDatetimeButton,
  IonIcon,
} from '@ionic/react'
import { closeOutline, chevronDownOutline } from 'ionicons/icons'

export default function Daily() {
  const modal = useRef<HTMLIonModalElement>(null)
  function dismiss() {
    modal.current?.dismiss()
  }
  return (
    <>
      <IonButton
        className="fab-buttun-daily"
        shape="round"
        id="open-modal-daily"
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
          <rect
            x="3"
            y="6"
            width="18"
            height="15"
            rx="2"
            stroke="#128F9D"
            stroke-width="2"
          />
          <path
            d="M3 10C3 8.11438 3 7.17157 3.58579 6.58579C4.17157 6 5.11438 6 7 6H17C18.8856 6 19.8284 6 20.4142 6.58579C21 7.17157 21 8.11438 21 10H3Z"
            fill="#128F9D"
          />
          <path
            d="M7 3L7 6"
            stroke="#128F9D"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M17 3L17 6"
            stroke="#128F9D"
            stroke-width="2"
            stroke-linecap="round"
          />
          <rect x="7" y="12" width="4" height="2" rx="0.5" fill="#128F9D" />
          <rect x="7" y="16" width="4" height="2" rx="0.5" fill="#128F9D" />
          <rect x="13" y="12" width="4" height="2" rx="0.5" fill="#128F9D" />
          <rect x="13" y="16" width="4" height="2" rx="0.5" fill="#128F9D" />
        </svg>
      </IonButton>

      <IonModal
        className="schedule-modal-daily"
        ref={modal}
        trigger="open-modal-daily"
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
                      fill="#92DBD8"
                      fill-opacity="0.21"
                    />
                    <rect
                      x="8"
                      y="10"
                      width="18"
                      height="15"
                      rx="2"
                      stroke="#128F9D"
                      stroke-width="2"
                    />
                    <path
                      d="M8 14C8 12.1144 8 11.1716 8.58579 10.5858C9.17157 10 10.1144 10 12 10H22C23.8856 10 24.8284 10 25.4142 10.5858C26 11.1716 26 12.1144 26 14H8Z"
                      fill="#128F9D"
                    />
                    <path
                      d="M12 7L12 10"
                      stroke="#128F9D"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                    <path
                      d="M22 7L22 10"
                      stroke="#128F9D"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                    <rect
                      x="12"
                      y="16"
                      width="4"
                      height="2"
                      rx="0.5"
                      fill="#128F9D"
                    />
                    <rect
                      x="12"
                      y="20"
                      width="4"
                      height="2"
                      rx="0.5"
                      fill="#128F9D"
                    />
                    <rect
                      x="18"
                      y="16"
                      width="4"
                      height="2"
                      rx="0.5"
                      fill="#128F9D"
                    />
                    <rect
                      x="18"
                      y="20"
                      width="4"
                      height="2"
                      rx="0.5"
                      fill="#128F9D"
                    />
                  </svg>
                </div>
                <div className="icon-label">
                  <IonLabel>日程</IonLabel>
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
              <IonInput placeholder="日程名称" mode="ios"></IonInput>
            </IonItem>
          </IonList>
          <IonList inset={true} lines="none" mode="ios">
            <IonItem>
              <IonLabel className="left">分类</IonLabel>
              <IonSelect
                className="flip"
                interface="popover"
                interfaceOptions={{
                  cssClass: 'Daily-select-interface',
                  showBackdrop: false,
                  size: 'auto',
                  mode: 'ios',
                  dismissOnSelect: true,
                  alignment: 'center',
                }}
                toggleIcon={chevronDownOutline}
                value="Unclassified"
                slot="end"
              >
                <IonSelectOption value="Unclassified" className="Unclassified">
                  未分类
                </IonSelectOption>
                <IonSelectOption value="Teams" className="Teams">
                  社团/组织
                </IonSelectOption>
                <IonSelectOption value="courses" className="courses">
                  课程
                </IonSelectOption>
                <IonSelectOption value="others" className="others">
                  其他
                </IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel className="left">开始时间</IonLabel>
              <IonDatetimeButton datetime="time1"></IonDatetimeButton>
              <IonModal keepContentsMounted={true}>
                <IonDatetime
                  id="time1"
                  presentation="time"
                  formatOptions={{
                    time: {
                      hour: '2-digit',
                      minute: '2-digit',
                    },
                  }}
                ></IonDatetime>
              </IonModal>
            </IonItem>
            <IonItem>
              <IonLabel className="left">结束时间</IonLabel>
              <IonDatetimeButton datetime="time2"></IonDatetimeButton>
              <IonModal keepContentsMounted={true}>
                <IonDatetime
                  id="time2"
                  presentation="time"
                  formatOptions={{
                    time: {
                      hour: '2-digit',
                      minute: '2-digit',
                    },
                  }}
                ></IonDatetime>
              </IonModal>
            </IonItem>
          </IonList>
          <IonList inset={true} lines="none" mode="ios">
            <IonItem>
              <IonLabel className="left">重复</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel className="left">提醒</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel className="left">备注</IonLabel>
            </IonItem>
          </IonList>
        </div>
      </IonModal>
    </>
  )
}


















