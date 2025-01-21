declare class ZJUAM {
  #private;
  username: string;
  password: string;
  iPlanetDirectoryPro: string;
  firstinLogin: boolean;
  constructor(username: string, password: string);
  login(): Promise<string>;
  fetch(url: string, options?: RequestInit): Promise<Response>;
  loginSvc(service: string): Promise<string>;
  loginSvc_oauth2(fullURL: string): Promise<string>;
}
export { ZJUAM };
declare class ZDBK {
  zjuamInstance: ZJUAM;
  cookies: {
    [key: string]: string;
  };
  constructor(am: ZJUAM);
  login(): Promise<void>;
  fetch(url: string, init?: RequestInit): Promise<Response>;
}
export { ZDBK };

declare class FORM {
  token: string;
  zjuamInstance: ZJUAM;
  constructor(am: ZJUAM);
  login(): Promise<boolean>;
  fetch(url: string): Promise<Response>;
}
export { FORM };
declare class COURSES {
  zjuamInstance: ZJUAM;
  session: string;
  firstTime: boolean;
  constructor(am: ZJUAM);
  login(): Promise<boolean>;
  fetch(url: string, options?: any): Promise<Response>;
}
export { COURSES };
declare class COURSE {
  zjuamInstance: ZJUAM;
  cookies: {
    [key: string]: string;
  };
  constructor(am: ZJUAM, mode: 'WEB' | 'APP');
  token: string;
  session: string;
  login(): Promise<void>;
}
export { COURSE };
declare class CLASSROOM {
  zjuamInstance: ZJUAM;
  token: string;
  constructor(am: ZJUAM);
  login(): Promise<void>;
  fetch(url: string, options?: RequestInit): Promise<Response>;
}
export { CLASSROOM };
