/**
 * 根据服务（域名）共享的ZjuamService，以减少登录次数、统一管理生命周期。
 */

import { ZjuamService } from '@/interop/zjuam'

export const sharedZjuamService = new ZjuamService(
  { service: 'http://zdbk.zju.edu.cn/jwglxt/xtgl/login_ssologin.html' },
  60 * 5,
)
