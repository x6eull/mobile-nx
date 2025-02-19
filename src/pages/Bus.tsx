import React, { useState, useEffect } from 'react'
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonList,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardContent,
  IonModal,
  IonDatetime,
  IonDatetimeButton,
  IonBackButton,
  IonListHeader,
} from '@ionic/react'
import {
  repeatOutline,
  codeOutline,
  timeOutline,
  todayOutline,
} from 'ionicons/icons'
import styles from './Bus.module.css' // 导入CSS Modules样式

const Bus: React.FC = () => {
  const [departureTime, setDepartureTime] = useState<string>(
    new Date().toISOString().slice(0, 16),
  ) // 默认当前时间
  const [departureDate, setDepartureDate] = useState<string>(
    new Date().toISOString().slice(0, 10),
  ) // 默认当前日期
  const [isBusSelected, setIsBusSelected] = useState(true) // 管理“班车”和“校园巴士”的切换状态
  const [departureCampus, setDepartureCampus] = useState<string>('') // 默认出发校区
  const [destinationCampus, setDestinationCampus] = useState<string>('') // 默认目的校区
  const [history, setHistory] = useState<any[]>([]) // 历史查询记录
  const [isQueryEnabled, setIsQueryEnabled] = useState<boolean>(false) // 判断是否可以查询

  const handleTimeChange = (event: any) => {
    setDepartureTime(event.target.value)
  }

  const handleDateChange = (event: any) => {
    setDepartureDate(event.target.value)
  }

  const handleToggleTitle = () => {
    setIsBusSelected(!isBusSelected) // 切换当前状态
  }

  // 处理校区交换
  const handleToggleCampuses = () => {
    setDepartureCampus(destinationCampus)
    setDestinationCampus(departureCampus)
  }

  // 处理查询按钮启用状态
  useEffect(() => {
    if (
      departureCampus &&
      destinationCampus &&
      departureTime &&
      departureCampus !== destinationCampus
    ) {
      setIsQueryEnabled(true)
    } else {
      setIsQueryEnabled(false)
    }
  }, [departureCampus, destinationCampus, departureTime])

  // 保存历史记录
  const saveHistory = () => {
    const newHistory = { departureCampus, destinationCampus, departureTime }
    const updatedHistory = [newHistory, ...history].slice(0, 3) // 保持最多3条记录，最新在前
    setHistory(updatedHistory)
    localStorage.setItem('busHistory', JSON.stringify(updatedHistory))
  }

  // 清除历史记录
  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('busHistory')
  }

  // 获取历史记录
  useEffect(() => {
    const savedHistory = localStorage.getItem('busHistory')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  // 查询按钮点击事件
  const handleQuery = () => {
    if (isQueryEnabled) {
      saveHistory()
      alert(
        `查询出发校区: ${departureCampus}，目的校区: ${destinationCampus}，出发时间: ${departureTime}`,
      )
    }
  }

  // 点击历史记录项时填充查询条件并进行查询
  const handleHistoryClick = (item: any) => {
    // 立即触发查询
    alert(
      `查询出发校区: ${item.departureCampus}，目的校区: ${item.destinationCampus}，出发时间: ${item.departureTime}`,
    )
  }

  return (
    <IonPage className={styles.busPage}>
      <IonHeader>
        {/* Header 标题区域 */}
        <IonToolbar>
          {/* 左侧返回按钮，点击后返回上层页面，如果没有上层页面则返回到tab1 */}
          <IonButtons slot="start">
            <IonBackButton defaultHref="tab1" />
          </IonButtons>
          {/* 班车和校园巴士切换，文字+按钮+文字 */}
          <IonTitle>
            <IonGrid>
              <IonRow className={styles.headerRow}>
                <IonCol
                  size="auto"
                  className={`${styles.headerText} ${isBusSelected ? styles.active : ''}`}
                >
                  班车
                </IonCol>
                <IonCol size="auto" className={styles.rowCenteredArrangement}>
                  <IonIcon
                    icon={repeatOutline}
                    onClick={handleToggleTitle} // 点击图标切换文字
                    style={{ cursor: 'pointer' }}
                  />
                </IonCol>
                <IonCol
                  size="auto"
                  className={`${styles.headerText} ${!isBusSelected ? styles.active : ''}`}
                >
                  校园巴士
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* 主查询卡片 */}
        <IonCard className={styles.mainCard}>
          <IonCardContent>
            <IonGrid>
              {/* 校区选择器，位于同一行 */}
              <IonItem style={{ width: '100%' }} className="ion-no-padding">
                <IonRow
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <IonCol style={{ flex: 1 }}>
                    {/* 出发校区选择器 */}
                    <IonItem lines="none" style={{ width: '100%' }}>
                      <IonSelect
                        value={departureCampus}
                        onIonChange={(e) => setDepartureCampus(e.detail.value)}
                        placeholder="出发地"
                        interface="popover"
                        justify="start"
                        style={{ width: '100%' }}
                      >
                        <IonSelectOption value="紫金港校区">
                          紫金港
                        </IonSelectOption>
                        <IonSelectOption value="玉泉校区则通楼北侧">
                          玉泉则通楼北侧
                        </IonSelectOption>
                        <IonSelectOption value="玉泉校区（4舍南侧）">
                          玉泉4舍南侧
                        </IonSelectOption>
                        <IonSelectOption value="西溪校区">西溪</IonSelectOption>
                        <IonSelectOption value="华家池校区">
                          华家池
                        </IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonCol>

                  <IonCol size="auto">
                    {/* 交换校区按钮 */}
                    <IonButton
                      onClick={handleToggleCampuses}
                      style={{ margin: '0 auto' }}
                    >
                      <IonIcon
                        icon={codeOutline}
                        style={{ cursor: 'pointer' }}
                        color="dark"
                      />
                    </IonButton>
                  </IonCol>

                  <IonCol style={{ flex: 1 }}>
                    {/* 目的校区选择器 */}
                    <IonItem lines="none" style={{ width: '100%' }}>
                      <IonSelect
                        value={destinationCampus}
                        onIonChange={(e) =>
                          setDestinationCampus(e.detail.value)
                        }
                        placeholder="目的地"
                        interface="popover"
                        justify="end"
                        style={{ width: '100%' }}
                      >
                        <IonSelectOption value="紫金港校区">
                          紫金港
                        </IonSelectOption>
                        <IonSelectOption value="玉泉校区则通楼北侧">
                          玉泉则通楼北侧
                        </IonSelectOption>
                        <IonSelectOption value="玉泉校区（4舍南侧）">
                          玉泉4舍南侧
                        </IonSelectOption>
                        <IonSelectOption value="西溪校区">西溪</IonSelectOption>
                        <IonSelectOption value="华家池校区">
                          华家池
                        </IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonCol>
                </IonRow>
              </IonItem>

              <IonRow
                className="ion-align-items-center"
                style={{
                  justifyContent: 'center',
                  gap: '15px',
                  marginTop: '10px',
                }}
              >
                <IonCol size="auto" style={{ textAlign: 'center' }}>
                  {/* 日期显示，格式为某月某日*/}
                  <IonLabel style={{ fontWeight: 'bold' }}>
                    今日
                    {new Date().toLocaleDateString('zh-CN', {
                      month: 'long',
                      day: 'numeric',
                    })}
                  </IonLabel>
                </IonCol>
                <IonCol size="auto" style={{ textAlign: 'center' }}>
                  <IonLabel style={{ fontSize: '12px' }}>选择出发时间</IonLabel>
                </IonCol>
                <IonCol size="auto" style={{ textAlign: 'center' }}>
                  {/* 日期选择器 */}
                  <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
                  <IonModal keepContentsMounted={true}>
                    <IonDatetime
                      id="datetime"
                      presentation="time"
                      value={departureTime}
                      onIonChange={handleTimeChange}
                      hourCycle="h23"
                      formatOptions={{
                        time: {
                          hour: '2-digit',
                          minute: '2-digit',
                        },
                      }}
                    ></IonDatetime>
                  </IonModal>
                </IonCol>
              </IonRow>
            </IonGrid>

            <IonButton
              onClick={handleQuery}
              disabled={!isQueryEnabled}
              expand="block"
              className={styles.queryButton}
            >
              查询
            </IonButton>
          </IonCardContent>
        </IonCard>

        {/* 历史记录 */}
        {history.length > 0 && (
          <IonGrid className={styles.moreInfo}>
            <IonListHeader>
              <IonLabel className={styles.rowCenteredArrangement}>
                <IonIcon icon={timeOutline} className={styles.iconSpacing} />
                历史记录
              </IonLabel>
              <IonButton
                fill="clear"
                onClick={clearHistory}
                className={styles.clearHistoryButton}
              >
                清除历史
              </IonButton>
            </IonListHeader>

            <IonList>
              {history.map((item, index) => (
                <IonItem
                  key={index}
                  button
                  onClick={() => handleHistoryClick(item)}
                  className={styles.historyItem}
                >
                  <IonLabel>{`${item.departureCampus} → ${item.destinationCampus}，${item.departureTime}`}</IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonGrid>
        )}
        {/*
        {history.length <= 0 && (
          <IonGrid>
            <IonCardContent>
              <IonLabel>暂无历史记录</IonLabel>
            </IonCardContent>
          </IonGrid>
        )}
        */}

        {/* 更多信息区块 */}
        <IonGrid className={styles.moreInfo}>
          <IonListHeader>
            <IonLabel className={styles.rowCenteredArrangement}>
              <IonIcon icon={todayOutline} className={styles.iconSpacing} />
              更多信息
            </IonLabel>
          </IonListHeader>
          <IonList>
            <IonItem button>
              <IonLabel>乘坐班车注意事项</IonLabel>
            </IonItem>
            <IonItem button>
              <IonLabel>浙江大学班车时刻表</IonLabel>
            </IonItem>
            <IonItem button>
              <IonLabel>紫金港循环车</IonLabel>
            </IonItem>
            <IonItem button>
              <IonLabel>紫金港教学区短驳班车</IonLabel>
            </IonItem>
          </IonList>
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default Bus
