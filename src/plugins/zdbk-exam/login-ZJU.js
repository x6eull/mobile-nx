/**
 * login-ZJU: A server-side library helping your application login to ZJU services
 * @author 5dbwat4<me@5dbwat4.top>
 * @version 1.0.1
 */
var g={};function x(s,n){let t=new URL(s).host;return g[t]=g[t]||{},g[t]&&(n.headers={Cookie:Object.entries(g[t]).
map(([e,o])=>`${e}=${o}`).join("; ")}),n.redirect="manual",fetch(s,n).then(e=>(e.headers.get("set-cookie")&&e.
headers.getSetCookie().forEach(o=>{let[i,a]=o.split("=");g[t][i]=a}),e))}var c=x;var d=class{zjuamInstance;session="";firstTime=!0;constructor(n){this.zjuamInstance=n}async login(){return console.
log("[COURSES] login begins"),c("https://courses.zju.edu.cn/user/index",{redirect:"manual"}).then(n=>{if(n.status==
302)return c(n.headers.get("Location"),{redirect:"manual"});throw new Error("Fail at first load.")}).then(n=>{
if(n.status==303)return c(n.headers.get("Location"),{redirect:"manual"});throw new Error("Fail at first load.")}).
then(async n=>{if(n.status==303){let t=await this.zjuamInstance.loginSvc(decodeURIComponent(n.headers.get("Loc\
ation").replace("https://zjuam.zju.edu.cn/cas/login?service=","")));return c(t,{redirect:"manual"})}else throw new Error(
"Fail at first load.")}).then(n=>{if(n.status==302)return c(n.headers.get("Location"),{redirect:"manual"});throw new Error(
"Fail at second load.")}).then(n=>{if(n.status==302)return console.log("[COURSES] Login success!"),this.session=
n.headers.get("Set-Cookie").split(";")[0].split("=")[1],!0;throw new Error("Fail at login.")})}async fetch(n,t={}){
return this.firstTime&&(await this.login(),this.firstTime=!1),console.log("[COURSES] Fetching url:",n),t.headers=
{...t?.headers,Cookie:"session="+this.session+";","X-Session-Id":this.session},fetch(n,t).then(e=>{if(e.headers.
get("Set-Cookie")){let o=e.headers.get("Set-Cookie").split(";")[0].split("=")[1];o!==this.session&&(this.session=
o)}return e})}};var m=class{zjuamInstance;cookies;constructor(n){this.zjuamInstance=n,this.cookies={}}async login(){let n=await this.
zjuamInstance.loginSvc("http://zdbk.zju.edu.cn/jwglxt/xtgl/login_ssologin.html");fetch(n,{redirect:"manual"}).
then(t=>{t.headers.getSetCookie().forEach(e=>{if(e.includes("Path=/javajw;"))return;let[o,i]=e.split(";")[0].split(
"=");this.cookies[o]=i}),t.status==302&&t.headers.get("Location")?.includes("http://zdbk.zju.edu.cn/jwglxt/xtg\
l/index_initMenu.html")&&fetch(t.headers.get("Location"),{redirect:"manual",headers:{Cookie:Object.entries(this.
cookies).map(([e,o])=>`${e}=${o}`).join("; ")}}).then(e=>{e.headers.getSetCookie().forEach(o=>{let[i,a]=o.split(
";")[0].split("=");this.cookies[i]=a})})})}async fetch(n,t){return fetch(n,{...t,headers:{Cookie:Object.entries(
this.cookies).map(([e,o])=>`${e}=${o}`).join("; "),...t?.headers}})}};function l(){let s={};return new Promise(n=>{n({fetch:async(t,e)=>{let o=new URL(t).origin;return fetch(t,{...e,
headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome\
/131.0.0.0 Safari/537.36 Edg/131.0.0.0","Accept-Language":"zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",...e?.
headers,cookie:Object.entries(s[o]||{}).map(([i,a])=>`${i}=${a}`).join("; ")}}).then(async i=>(i.headers.getSetCookie().
forEach(a=>{let[h,u]=a.split(";")[0].split("=");s[o]=s[o]||{},s[o][h]=u}),i))},extractCookie:(t,e)=>s[t][e]||"",
injectCookie:(t,e,o)=>{s[t]=s[t]||{},s[t][e]=o}})})}function y(s,n,t){let e=0n;for(let u of s)e=e*256n+BigInt(u.charCodeAt(0));let o=BigInt("0x"+t),i=BigInt("0x"+
n);return(e**i%o).toString(16)}var C="https://zjuam.zju.edu.cn/cas/v2/getPubKey";var f=class{username;password;iPlanetDirectoryPro;firstinLogin=!0;constructor(n,t){this.username=n,this.password=
t,this.iPlanetDirectoryPro=""}#t(n){return console.log("[ZJUAM] Attempting to login to ZJUAM."),new Promise(async(t,e)=>{
l().then(async o=>{let a=(await o.fetch(n).then(r=>r.text()).catch(r=>{e({message:"Failed when fetch login pag\
e at first time."})})).match(/name="execution" value="([^"]+)"/)?.[1]??"";a||e({message:"First-time login page\
 doesn't contain execution string."});let h=await o.fetch(C).then(r=>r.json()).catch(r=>{e({message:"Failed wh\
en fetch pubkey."})}),u=y(this.password,h.exponent,h.modulus),L=await o.fetch(n,{method:"POST",body:["username\
="+this.username,"password="+u,"execution="+a,"_eventId=submit","authcode="].join("&"),headers:{"Content-Type":"\
application/x-www-form-urlencoded"},redirect:"manual"}).then(async r=>{if(console.log(await r.text()),r.status===
302)this.firstinLogin=!0,console.log("[ZJUAM] Login success."),this.iPlanetDirectoryPro=o.extractCookie(new URL(
"https://zjuam.zju.edu.cn/cas/login").origin,"iPlanetDirectoryPro"),t(r.headers.get("Location"));else if(r.status===
200){let z=(await r.text()).match(/\<span id=\"msg\"\>([^<]+)<\/span>/)?.[1];e({message:"Failed to login: "+z})}else
e({message:"Failed to login with status code "+r.status})})})})}login(){return this.#t("https://zjuam.zju.edu.\
cn/cas/login")}async fetch(n,t={}){return this.firstinLogin&&await this.login().catch(e=>{console.error(e)}),t.
headers={...t.headers,Cookie:`iPlanetDirectoryPro=${this.iPlanetDirectoryPro}`,"User-Agent":"Mozilla/5.0 (Wind\
ows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0"},
fetch(n,t)}async loginSvc(n){console.log("[ZJUAM] Attempting to login to service: "+n);let t="https://zjuam.zj\
u.edu.cn/cas/login?service="+encodeURIComponent(n);return this.firstinLogin?await this.fetch(t,{redirect:"manu\
al",method:"GET"}).then(e=>e.status==302?e.headers.get("Location"):e.status==200?this.#t(t):Promise.reject({message:"\
Login failed with status "+e.status})):this.#t(t)}async loginSvc_oauth2(n){return console.log("[ZJUAM] Attempt\
ing to login to oauth2 service: "+n),this.firstinLogin&&await this.login().catch(t=>{console.error(t)}),l().then(
async t=>(t.injectCookie(new URL(n).origin,"iPlanetDirectoryPro",this.iPlanetDirectoryPro),t.fetch(n,{redirect:"\
manual"}).then(e=>{if(e.status==302)return e.headers.get("Location");throw new Error("Login failed with status\
 "+e.status)}).then(e=>t.fetch(e,{redirect:"manual"})).then(e=>{if(e.status==302)return e.headers.get("Locatio\
n");throw new Error("Login failed with status "+e.status)}).then(e=>t.fetch(e,{redirect:"manual"})).then(e=>{if(e.
status==302)return e.headers.get("Location");throw new Error("Login failed with status "+e.status)})))}};var p=class{zjuamInstance;cookies;constructor(n,t){this.zjuamInstance=n,this.cookies={}}token="";session;async login(){
let n=await this.zjuamInstance.loginSvc("https://course.zju.edu.cn/ua/login?platform=WEB");console.log(n),await fetch(
n,{redirect:"manual"}).then(t=>(console.log(t.status),console.log(t.headers.getSetCookie()),t.headers.getSetCookie().
forEach(e=>{let[o,i]=e.split(";")[0].split("=");this.cookies[o]=i}),t.headers.get("Location"))).then(t=>fetch(
t,{redirect:"manual",headers:{Cookie:Object.entries(this.cookies).map(([e,o])=>`${e}=${o}`).join("; ")}})).then(
t=>(console.log(t.status),console.log(t.headers.getSetCookie()),console.log(t.headers.get("Location")),this.token=
new URL(t.headers.get("Location")).searchParams.get("token"),fetch(t.headers.get("Location"),{}))).then(t=>{console.
log(t.status),console.log(t.headers.getSetCookie()),console.log(t.headers.get("Location"))})}};var j="https://form.zju.edu.cn/",k=class{token="";zjuamInstance;constructor(n){this.zjuamInstance=n}async login(){
return console.log("[FORM] login begins"),this.zjuamInstance.loginSvc(j).then(n=>{let t=n.split("ticket=")[1].
split("&")[0];return fetch(`https://form.zju.edu.cn/dfi/validateLogin?ticket=${t}&service=${encodeURIComponent(
j)}`)}).then(n=>n.json()).then(n=>{if(n.code===2e3)return console.log("[FORM] login success"),this.token=n.data.
token,!0}).catch(n=>{throw n})}async fetch(n){this.token===""&&await this.login();try{let t=await fetch(n,{headers:{
authentication:this.token}});if(t.status===200)return t;if(t.status===401||t.status===403)return this.token="",
this.fetch(n);throw new Error(`Request failed with status ${t.status}`)}catch(t){throw console.error("Fetch er\
ror:",t),t}}};var w=class{zjuamInstance;token;constructor(n){this.zjuamInstance=n,this.token=""}async login(){return console.
log("[CLASSROOM] Attempting to login to classroom.zju.edu.cn"),l().then(async n=>{await n.fetch("https://tgmed\
ia.cmc.zju.edu.cn/index.php?r=auth%2Flogin&forward=https%3A%2F%2Fclassroom.zju.edu.cn%2F",{redirect:"manual"}).
then(async e=>{if(e.status===302)return e.headers.get("Location");throw new Error("Failed to login")}).then(async e=>this.
zjuamInstance.loginSvc_oauth2(e)).then(async e=>(e.startsWith("http://")&&(e=e.replace("http://","https://")),
n.fetch(e,{redirect:"manual"}).then(async o=>{if(o.status===302)return o.headers.get("Location");throw new Error(
"Failed to login")})));let t=decodeURIComponent(n.extractCookie(new URL("https://tgmedia.cmc.zju.edu.cn/").origin,
"_token"));this.token=t.split(":").filter(e=>e.startsWith('"ey'))[0].split('"')[1]})}async fetch(n,t={}){(!this.
token||this.token.length===0)&&await this.login();let e={...t.headers,Authorization:`Bearer ${this.token}`};return fetch(
n,{headers:e})}};export{w as CLASSROOM,p as COURSE,d as COURSES,k as FORM,m as ZDBK,f as ZJUAM};
//# sourceMappingURL=login-ZJU.js.map
