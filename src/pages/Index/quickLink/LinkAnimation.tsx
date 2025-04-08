import { useState, useRef, useEffect, ReactElement } from 'react'

export default function LinkAnimation(props: {
  href: string
  children: ReactElement
}) {
  /**制作一个点击回弹效果，并保证动画结束后再跳转 */
  const [isAnimating, setIsAnimating] = useState(false) // 控制动画状态
  const linkRef = useRef<HTMLAnchorElement>(null) // 使用ref来引用DOM元素

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault() // 阻止默认的跳转行为
    setIsAnimating(true) // 触发动画
  }

  useEffect(() => {
    if (isAnimating && linkRef.current) {
      // 添加动画类
      linkRef.current.style.animation = 'bounce 0.3s ease-out'

      // 动画完成后跳转
      const timeoutId = setTimeout(() => {
        if (linkRef.current) {
          window.location.href = linkRef.current.getAttribute('href') as string // 跳转到目标页面
        }
        setIsAnimating(false) // 重置动画状态
      }, 300) // 动画持续时间（0.3s）

      // 清理定时器
      return () => clearTimeout(timeoutId)
    }
  }, [isAnimating])

  return (
    <a ref={linkRef} onClick={handleClick} href={props.href}>
      {props.children}
    </a>
  )
}
