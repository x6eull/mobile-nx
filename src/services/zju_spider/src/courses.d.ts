import type { ZJUAM } from "./zjuam";
declare class COURSES {
    zjuamInstance: ZJUAM;
    session: string;
    firstTime: boolean;
    constructor(am: ZJUAM);
    login(): Promise<boolean>;
    fetch(url: string, options?: any): Promise<Response>;
}
export { COURSES };
