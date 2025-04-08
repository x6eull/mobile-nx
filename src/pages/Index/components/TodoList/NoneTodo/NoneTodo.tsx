import './NoneTodo.css'

// 扩展 CSSProperties 类型
type CustomCSSProperties = React.CSSProperties & {
  '--rotate-angle': string
}
const NoneTodo: React.FC = () => {
  const dots = Array.from({ length: 36 }, (_, index) => {
    const rotateAngle = (index + 1) * 10
    const customStyle: CustomCSSProperties = {
      '--rotate-angle': `${rotateAngle}deg`,
    }
    return <div key={index} className="dot" style={customStyle}></div>
  })

  return (
    <div className="loading">
      {dots}
      <div className="name">暂无待办</div>
    </div>
  )
}

export default NoneTodo
