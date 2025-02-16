import type { ZJUAM } from "./zjuam";
declare class COURSE {
    zjuamInstance: ZJUAM;
    cookies: {
        [key: string]: string;
    };
    constructor(am: ZJUAM, mode: "WEB" | "APP");
    token: string;
    session: string;
    login(): Promise<void>;
}
export { COURSE };
