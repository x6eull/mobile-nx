import type { ZJUAM } from "./zjuam";
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
