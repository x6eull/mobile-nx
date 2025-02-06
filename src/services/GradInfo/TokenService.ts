// TokenService.ts
import { config } from 'dotenv';
config({ path: '.env.local' });

import axios from 'axios';
import { requestCredential } from '../../interop/credential';
import { ZjuamService } from '../../interop/zjuam';

export async function getToken(): Promise<string | null> {
  const service = new ZjuamService({
    service: 'https://yjsy.zju.edu.cn/'
  });

  const { username, password } = await requestCredential(null as any);
  const finalUrl = await service.login();

  const ticket = new URL(finalUrl).searchParams.get('ticket');
  if (!ticket) {
    return null;
  }

  const yjsyTokenUrl = "https://yjsy.zju.edu.cn/dataapi/sys/cas/client/validateLogin?service=https://yjsy.zju.edu.cn/";
  const tokenResponse = await axios.get(yjsyTokenUrl, {
    params: { ticket }
  });

  return tokenResponse.data?.result?.token || null;
}
