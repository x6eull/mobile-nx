import '@/main.tsx'
import test from 'node:test'
import { ZjuamService } from '@/services/base/zjuam.ts'
import store from '@/store/store.ts'
import { setUser } from '@/store/user.ts'

test('login/success', async () => {
  let zjuam = new ZjuamService({
    service: 'http://zdbk.zju.edu.cn/jwglxt/xtgl/login_ssologin.html',
  })
  const ret = await zjuam.login()
  console.log('ret', ret)
})

test('login/password-error', async () => {
  const user = store.getState().user!
  store.dispatch(setUser({ zjuId: user.zjuId, password: 'aaasadadasdas' }))
  let zjuam = new ZjuamService({
    service: 'http://zdbk.zju.edu.cn/jwglxt/xtgl/login_ssologin.html',
  })
  try {
    await zjuam.login()
  } catch (e) {
    console.log('e', e)
    return
  }
  throw new Error('没有正确抛出异常')
})
