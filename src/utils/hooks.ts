import { useEffect, useState } from 'react'

/**React Hook，返回一个使用state存储的Date，定期刷新该state */
export function useTime(refreshInMs: number): Date {
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    if (refreshInMs <= 0) return
    const interval = setInterval(() => {
      setTime(new Date())
    }, refreshInMs)
    return () => clearInterval(interval)
  })
  return time
}
