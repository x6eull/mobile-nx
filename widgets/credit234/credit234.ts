import nx from '../../extHelper'

const service = await nx.newZjuamService({
  service: 'http://sztz.zju.edu.cn/dekt/',
})

const result = (await (
  await service.nxFetch('http://sztz.zju.edu.cn/dekt/student/home/getMyInfo')
).json()) as {
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
console.log(result)
const {
  extend: {
    myInfo: { dektJf: credit2, dsktJf: credit3, dsiktJf: credit4 },
  },
} = result
document.body.innerText = `二课分:${credit2}\n三课分:${credit3}\n四课分:${credit4}`
await nx.setWidgetHeight(document.body.scrollHeight)
