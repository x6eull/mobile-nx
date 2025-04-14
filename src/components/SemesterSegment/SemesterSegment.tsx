import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/react'
import './SemesterSegment.css'
import {
  fromSemesterNumber,
  Semester,
  SemesterNumber,
  termNames,
  toSemesterNumber,
} from '@/models/Semester'
import { useEffect, useMemo } from 'react'

/**
 * 学期选择器。
 */
export default function SemesterSegment({
  value,
  onChange,
  items,
}: {
  value: Semester | null
  onChange: (value: Semester) => void
  items: Semester[]
}) {
  const valueSemesterNumber = value ? toSemesterNumber(value) : undefined
  const itemsWithValueInNumber = useMemo(
    () =>
      items.map((i) => ({
        label: `${i.year} ${termNames.get(i.term)}`,
        value: toSemesterNumber(i),
      })),
    [items],
  )
  useEffect(() => {
    //如果value为null且items非空，则默认选择最后一个
    if (value === null && items.length) onChange(items.at(-1)!)
  }, [value, items, onChange])

  //TODO IonSegment在PC上不能横向滚动，但是模拟移动设备时可以
  return (
    <div className='semester-segment-container'>
      <IonSegment
        value={valueSemesterNumber}
        onIonChange={(e) =>
          onChange(fromSemesterNumber(e.detail.value as SemesterNumber))
        }
        className='segment no-scrollbar'
        scrollable={true}
      >
        {itemsWithValueInNumber.map((i) => (
          <IonSegmentButton key={i.value} value={i.value} className='button'>
            <IonLabel>{i.label}</IonLabel>
          </IonSegmentButton>
        ))}
      </IonSegment>
    </div>
  )
}
