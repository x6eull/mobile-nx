import { env } from './env'
import { ZjuamService } from '../services/ZjuamService'

export type Credential = {
  username: string
  password: string
}
// eslint-disable-next-line @typescript-eslint/require-await
export async function requestCredential(
  service: ZjuamService,
): Promise<Credential> {
  console.warn('requestCredential from:', service)

  const username = env('VITE_USERNAME')
  const password = env('VITE_PASSWORD')
  if (!(username && password))
    throw new ReferenceError('未设置(开发时)用户名密码')
  return { username, password }
}
