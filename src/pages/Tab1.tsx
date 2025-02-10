import React, { useRef } from 'react'
import {
  IonBackButton,
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonModal,
  IonButtons,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSegmentView,
  IonSegmentContent,
  IonGrid,
  IonCol,
  IonRow,
  IonInput,
  IonList,
  IonItem,
  IonToggle,
  IonDatetime,
  IonDatetimeButton,
} from '@ionic/react'
import { add } from 'ionicons/icons'
import './Tab1.css'

const Tab1: React.FC = () => {
  const modal = useRef<HTMLIonModalElement>(null)

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="fixed-button-container">
          <IonButton shape="round" id="open-modal" expand="block" size="large">
            <IonIcon
              icon={add}
              color="white"
              size="large"
              slot="icon-only"
            ></IonIcon>
          </IonButton>
        </div>

        <IonModal
          ref={modal}
          trigger="open-modal"
          initialBreakpoint={1}
          breakpoints={[0, 1]}
        >
          <IonHeader className="ion-no-border">
            <IonToolbar>
              <div>
                <div>
                  <IonTitle>日程</IonTitle>
                </div>
                <div>
                  <IonSegment value="course" mode="md">
                    <IonSegmentButton value="general" contentId="general">
                      <IonLabel>通用</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="course" contentId="course">
                      <IonLabel>课程</IonLabel>
                    </IonSegmentButton>
                  </IonSegment>
                </div>
                <div>
                  <IonButtons>
                    <IonButton size="small">
                      <IonLabel>编辑/保存</IonLabel>
                    </IonButton>
                  </IonButtons>
                </div>
              </div>
            </IonToolbar>
          </IonHeader>

          <IonSegmentView>
            <IonSegmentContent id="general" class="Segment-general">
              <IonList inset={false} lines="full" mode="md">
                <IonItem className="custom-input-item">
                  <IonInput placeholder="日程名称" mode="ios"></IonInput>
                </IonItem>
              </IonList>
              <IonList inset={true} lines="none" mode="ios">
                <IonItem>
                  <IonToggle>全天</IonToggle>
                </IonItem>
                <IonItem>
                  <IonLabel>开始时间</IonLabel>
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
                  <IonLabel>结束时间</IonLabel>
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
                  <IonLabel>重复</IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>提醒</IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>备注</IonLabel>
                </IonItem>
              </IonList>
            </IonSegmentContent>
            <IonSegmentContent id="course">
              <IonList inset={false} lines="full" mode="md">
                <IonItem className="custom-input-item">
                  <IonInput placeholder="课程名称" mode="ios"></IonInput>
                </IonItem>
              </IonList>
              <IonList inset={true} lines="inset" mode="ios" className="solid">
                <IonItem>
                  <IonLabel>时间</IonLabel>
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
                  <IonLabel>地点</IonLabel>
                  <IonLabel class="right">东2-201</IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>教师</IonLabel>
                  <IonLabel class="right">苏德矿</IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>学期</IonLabel>
                  <IonLabel class="right">25年 春夏</IonLabel>
                </IonItem>
              </IonList>
              <IonList inset={true} lines="inset" mode="ios" className="solid">
                <IonItem>
                  <IonLabel className="left">成绩构成</IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>平时成绩</IonLabel>
                  <IonLabel class="right">60%</IonLabel>
                </IonItem>
                <IonItem>
                  <IonList>
                    <IonItem>
                      <IonLabel>考勤</IonLabel>
                      <IonLabel class="right">20%</IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel>作业</IonLabel>
                      <IonLabel class="right">20%</IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel>实验</IonLabel>
                      <IonLabel class="right">20%</IonLabel>
                    </IonItem>
                  </IonList>
                </IonItem>
                <IonItem>
                  <IonLabel>期末成绩</IonLabel>
                  <IonLabel class="right">40%</IonLabel>
                </IonItem>
              </IonList>
            </IonSegmentContent>
          </IonSegmentView>
        </IonModal>
      </IonContent>
    </IonPage>
  )
}

export default Tab1
