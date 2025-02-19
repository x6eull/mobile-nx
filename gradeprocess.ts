import { config } from 'dotenv'
config({ path: '.env.local' })

import { requestCredential } from './src/interop/credential'
import { ZjuamService } from './src/interop/zjuam'

const service = new ZjuamService({
  service: 'http://zdbk.zju.edu.cn/jwglxt/xtgl/login_ssologin.html',
})
const { username } = await requestCredential(null as any)
const response = await service.nxFetch.postJson(
  `http://zdbk.zju.edu.cn/jwglxt/cxdy/xscjcx_cxXscjIndex.html?doType=query&gnmkdm=N5083&su=${username}`,
  {
    doType: 'query',
    gnmkdm: 'N5083',
    su: '3240100550',
  },
)
export const data = await response.json()

//console.log(items.length)
