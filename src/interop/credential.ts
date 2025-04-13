import { env } from './env'
import { ZjuamService } from '../services/ZjuamService'

let username = env('VITE_USERNAME'),
  password = env('VITE_PASSWORD')
export function updateCredential(
  newUsername: string,
  newPassword: string,
): void {
  username = newUsername
  password = newPassword
}
export type Credential = {
  username: string
  password: string
}
// eslint-disable-next-line @typescript-eslint/require-await
export async function requestCredential(
  service: ZjuamService,
): Promise<Credential> {
  console.warn('requestCredential from:', service)
  if (!(username && password)) throw new ReferenceError('未设置用户名密码')
  return { username, password }
}
