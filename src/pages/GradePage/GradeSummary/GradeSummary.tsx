import './GradeSummary.css'

export default function GradeSummary({
  credits,
  gpa5,
  gpa4_3,
  gpa100,
  lastUpdated,
}: {
  credits: number
  gpa5: number
  gpa4_3: number
  gpa100: number
  lastUpdated: string
}) {
  return (
    <div className='grade-summary'>
      <div className='summary-row'>
        <div className='field'>
          <div className='label'>总学分</div>
          <div className='value'>{credits.toFixed(1)}</div>
        </div>
        <div className='field'>
          <div className='label'>总均绩</div>
          <div className='value'>{gpa5.toFixed(2)}</div>
        </div>
        <div className='field'>
          <div className='label'>4.3分制</div>
          <div className='value'>{gpa4_3.toFixed(2)}</div>
        </div>
        <div className='field'>
          <div className='label'>百分制</div>
          <div className='value'>{gpa100.toFixed(1)}</div>
        </div>
      </div>
      <div className='update-time'>更新时间：{lastUpdated}</div>
    </div>
  )
}
