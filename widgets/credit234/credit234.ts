/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import nx from '../../extHelper'

const r = await nx.newZjuamService({
  service: 'http://sztz.zju.edu.cn/dekt/',
})

const rs = await (
  await r.nxFetch('http://sztz.zju.edu.cn/dekt/student/home/getMyInfo')
).json()
console.log(rs)
const {
  extend: {
    myInfo: { dektJf: credit2, dsktJf: credit3, dsiktJf: credit4 },
  },
} = rs as {
  extend: {
    myInfo: {
      xm: string
      xh: string
      /**二课分 */
      dektJf: number
      /**三课分 */
      dsktJf: number
      /**四课分 */
      dsiktJf: number
    }
  }
}
document.body.innerText = `二课分:${credit2}\n三课分:${credit3}\n四课分:${credit4}`
await nx.setWidgetHeight(document.body.scrollHeight)
