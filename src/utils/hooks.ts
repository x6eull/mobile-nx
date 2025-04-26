import dayjs, { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'

/**React Hook，返回一个使用state存储的Date，定期刷新该state */
export function useTime(refreshInMs: number): Dayjs {
  const [time, setTime] = useState(() => dayjs())
  useEffect(() => {
    if (refreshInMs <= 0) return
    const interval = setInterval(() => {
      setTime(dayjs())
    }, refreshInMs)
    return () => clearInterval(interval)
  })
  return time
}
