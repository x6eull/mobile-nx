import nx from '../../extHelper'

import { useEffect, useState } from 'react'
import 'github-markdown-css'
import React from 'react'
import ReactDOM from 'react-dom/client'
interface Rollcall {
  course_id: number
  course_title: string
  created_by_name: string
  department_name: string
  is_expired: boolean
  is_number: boolean
  is_radar: boolean
  rollcall_time: string
  rollcall_status: string
  rollcall_id: number
  title: string
  status: string
  //... and other properties
}

let initialized = false

export default function App() {
  const [status, updateStatus] = useState('尚未初始化')

  let [rollcalls, updateRollcalls] = useState<Rollcall[]>([])

  console.log('Toolkit initialized')
  if (!initialized) {
    initialized = true
    ;(async () => {
      const service = await nx.newZjuamService(
        {
          follow: `https://identity.zju.edu.cn/auth/realms/zju/protocol/cas/login?ui_locales=zh-CN&service=https%3A//courses.zju.edu.cn/user/index`,
        },
        60 * 10,
      )

      updateStatus('更新数据中...')

      let updateAt = new Date()

      const updateInterval = setInterval(async () => {
        const result = (await (
          await service.nxFetch(
            'https://courses.zju.edu.cn/api/radar/rollcalls',
          )
        ).json()) as {
          rollcalls: Rollcall[]
        }
        updateRollcalls(result.rollcalls)
        rollcalls = result.rollcalls
        updateAt = new Date()
      }, 10_000)

      const timer = setInterval(() => {
        updateStatus(
          `当前有 ${rollcalls.length} 个签到. (数据更新于${Math.floor((new Date().getTime() - updateAt.getTime()) / 1000)}秒前)`,
        )
      }, 1000)

      await nx.setWidgetHeight(500)
    })()
  }

  return (
    <div className='markdown-body'>
      <h1>学在浙大签到监听器</h1>
      <p>{status}</p>
      <>
        {rollcalls.map((rollcall) => {
          //TODO: 等下一次有签到时看一下具体的签到网页的网址组成，目前的版本是学在浙大的rollcall list页面
          return (
            <blockquote>
              <b>{rollcall.course_title}</b>
              {rollcall.is_number && '数字'}
              {rollcall.is_radar && '雷达'}点名了！
              <p>签到标题：{rollcall.title}</p>
              <p>
                发起人：{rollcall.created_by_name}({rollcall.department_name})
              </p>
              <a href='https://mcourses.zju.edu.cn/ongoing-rollcall-list'>
                现在去签到（将进入系统浏览器）
              </a>
            </blockquote>
          )
        })}
      </>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('app')!).render(<App />)
