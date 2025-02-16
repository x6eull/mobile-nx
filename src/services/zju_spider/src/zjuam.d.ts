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
