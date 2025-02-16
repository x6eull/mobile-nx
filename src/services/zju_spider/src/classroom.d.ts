import type { ZJUAM } from "./zjuam";
declare class CLASSROOM {
    zjuamInstance: ZJUAM;
    token: string;
    constructor(am: ZJUAM);
    login(): Promise<void>;
    fetch(url: string, options?: RequestInit): Promise<Response>;
}
export { CLASSROOM };
