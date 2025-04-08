/**参考RFC-5545，此为单个VEVENT。 */
export interface Event {
  /**事件的唯一标识符 */
  uid: string
  /**创建/更改时间 */
  dtstamp: Date
  /**开始时间 */
  dtstart: Date
  /**结束时间 */
  dtend: Date
  /**事件标题 */
  summary: string
  /**事件描述 */
  description?: string
  /**事件地点 */
  location?: string
  /**生成事件的课程选课号(若有) */
  'x-course-id'?: string
  /**日程类别。标准中支持多个逗号分隔值，此处只接受单个值。 */
  categories: 'custom' | 'class' | 'exam'

  //TODO rrule, exdate, etc.
}

/**只转义换行、反斜杠、分号、逗号。不对长文本进行分行。 */
function encodeICalendarText(text: string): string {
  return text
    .replace(/\r/g, '')
    .replace(/\n/g, '\\n')
    .replace(/([\\;,])/g, '\\$1')
}

/**按rfc标准，转换为类似19980119T070000Z的格式(FORM #2: DATE WITH UTC TIME) */
function encodeICalendarDate(date: Date): string {
  return date.toISOString().replace(/[-:]|\.\d+/g, '')
}

export function toICalendar(events: Event[]): string {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:mobile-nx',
    ...events
      .map((ev) => [
        'BEGIN:VEVENT',
        ...Object.entries(ev)
          .map(([key, value]) => {
            // rfc5545标准不区分键名大小写，但为了兼容性键名转大写
            key = key.toUpperCase()
            if (typeof value === 'string')
              return `${key}:${encodeICalendarText(value)}`
            else if (value instanceof Date)
              return `${key}:${encodeICalendarDate(value)}`
            else throw new Error(`Invalid value type for key ${key}`)
          })
          .flat(1),
        'END:VEVENT',
      ])
      .flat(1),
    'END:VCALENDAR',
  ].join('\r\n')
}
