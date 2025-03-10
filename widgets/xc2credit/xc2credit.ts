/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import nx from '../../extHelper'

// 避免vite热重载后widget高度归零
self.addEventListener('message', ({ data }) => {
  if (data.init === true) {
    nx.setWidgetHeight(document.body.scrollHeight).catch((e) => {
      throw e
    })
  }
})

async function Getxc2credit(): Promise<string> {
  const r = await nx.newZjuamService({
    follow: 'http://csxszc.zju.edu.cn/',
  })
  const rs = await (
    await r.nxFetch('http://csxszc.zju.edu.cn/api//events')
  ).json()
  console.log(rs)
  const { events: event } = rs as {
    events: {
      archieve: boolean
      grade: number
      name: string
      score: string
      semester: string
      eid: number
    }[]
  }
  let score: number = 0
  for (let i = 0; i < event.length; i++)
    if (event[i].archieve) {
      if (isNaN(Number(event[i].score))) console.log('数据出错！！！')
      score += Number(event[i].score)
    }
  return '形策二课分:' + String(score)
}

document.body.innerText = await Getxc2credit()
await nx.setWidgetHeight(document.body.scrollHeight)
