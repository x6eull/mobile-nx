import './Study.css'
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
  IonDatetime,
  IonDatetimeButton,
  IonIcon,
  IonTextarea,
} from '@ionic/react'
import StudyIcon from '../icon/Study.svg'
import { closeOutline } from 'ionicons/icons'

// 课程
export default function Study() {
  const modal = useRef<HTMLIonModalElement>(null)
  async function dismiss() {
    await modal.current?.dismiss()
  }
  return (
    <>
      <IonButton
        className='fab-button-study'
        shape='round'
        id='open-modal'
        expand='block'
        size='small'
      >
        <img src={StudyIcon} alt='Study' />
      </IonButton>

      <IonModal
        className='schedule-modal-study'
        ref={modal}
        trigger='open-modal'
        initialBreakpoint={1}
        breakpoints={[0, 1]}
      >
        <IonHeader className='ion-no-border'>
          <IonToolbar>
            <div className='bar'>
              <div className='title'>
                <div className='icon-calendar'>
                  <img src={StudyIcon} alt='Study' />
                </div>
                <div className='icon-label'>
                  <IonLabel>课程</IonLabel>
                </div>
              </div>
              <IonButtons>
                <IonButton className='editor' size='large'>
                  <IonLabel>编辑</IonLabel>
                </IonButton>
                <IonButton
                  className='close'
                  size='small'
                  onClick={() => {
                    void dismiss()
                  }}
                >
                  <IonIcon icon={closeOutline} size='large'></IonIcon>
                </IonButton>
              </IonButtons>
            </div>
          </IonToolbar>
        </IonHeader>

        <div className='content'>
          <IonList inset={false} lines='full' mode='md'>
            <IonItem className='custom-input-item'>
              <IonInput placeholder='课程名称' mode='ios'></IonInput>
            </IonItem>
          </IonList>
          <IonList inset={true} lines='inset' mode='ios' className='solid'>
            <IonItem>
              <IonLabel className='left'>时间</IonLabel>
              <IonDatetimeButton datetime='course-time'></IonDatetimeButton>
              <IonModal keepContentsMounted={true}>
                <IonDatetime
                  id='course-time'
                  presentation='date-time'
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
              <IonLabel className='left'>地点</IonLabel>
              <IonLabel class='right'>东2-201</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel className='left'>教师</IonLabel>
              <IonLabel class='right'>苏德矿</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel className='left'>学期</IonLabel>
              <IonLabel class='right'>25年 春夏</IonLabel>
            </IonItem>
          </IonList>
          <IonList inset={true} lines='inset' mode='ios' className='solid'>
            <IonItem>
              <IonLabel className='left'>备注</IonLabel>
            </IonItem>
            <IonItem>
              <IonTextarea
                autoGrow={true}
                placeholder='可添加成绩构成等课程说明'
              ></IonTextarea>
            </IonItem>
          </IonList>
        </div>
      </IonModal>
    </>
  )
}
