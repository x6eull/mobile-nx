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
import dailyIcon from '../../svg/Daily.svg'
import { closeOutline, chevronDownOutline } from 'ionicons/icons'

export default function Daily() {
  const modal = useRef<HTMLIonModalElement>(null)
  function dismiss() {
    modal.current?.dismiss()
  }
  return (
    <>
      <IonButton
        className="fab-button-daily"
        shape="round"
        id="open-modal-daily"
        expand="block"
        size="small"
      >
        <img src={dailyIcon} alt="Daily" />
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
                  <img src={dailyIcon} alt="Daily" />
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































