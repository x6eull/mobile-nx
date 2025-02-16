import type { ZJUAM } from "./zjuam";
declare class FORM {
    token: string;
    zjuamInstance: ZJUAM;
    constructor(am: ZJUAM);
    login(): Promise<boolean>;
    fetch(url: string): Promise<Response>;
}
export { FORM };
