import './GradeSummary.css'

export default function GradeSummary({
  credits,
  gpa5,
  gpa4_3,
  gpa100,
  lastUpdated,
}: {
  credits: string
  gpa5: string
  gpa4_3: string
  gpa100: string
  lastUpdated: string
}) {
  return (
    <div className='grade-summary'>
      <div className='summary-row'>
        <div className='field'>
          <div className='label'>总学分</div>
          <div className='value'>{credits}</div>
        </div>
        <div className='field'>
          <div className='label'>总均绩</div>
          <div className='value'>{gpa5}</div>
        </div>
        <div className='field'>
          <div className='label'>4.3分制</div>
          <div className='value'>{gpa4_3}</div>
        </div>
        <div className='field'>
          <div className='label'>百分制</div>
          <div className='value'>{gpa100}</div>
        </div>
      </div>
      <div className='update-time'>上次更新时间：{lastUpdated}</div>
    </div>
  )
}
