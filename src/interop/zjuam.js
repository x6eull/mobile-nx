"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZjuamService = void 0;
//TODO 优化依赖/逻辑
var bigintModArith = require("bigint-mod-arith");
var fetch_1 = require("./fetch");
var credential_1 = require("./credential");
var zod_1 = require("zod");
/**将字符串用utf-8编码，再将字节序列转为bigint，越靠前的字符处于越高位 */
function encodeAsBigInt(s) {
    var res = 0n;
    new TextEncoder().encode(s).forEach(function (byte) {
        res <<= 8n;
        res |= BigInt(byte);
    });
    return res;
}
/**对于不同服务，编码参数，获得入口点 */
function getEntryUrl(params) {
    if ('service' in params)
        return "https://zjuam.zju.edu.cn/cas/login?".concat(new URLSearchParams(params));
    else if ('client_id' in params)
        //oauth2会被重定向到https://zjuam.zju.edu.cn/cas/login?service=http%3A%2F%2Fzjuam.zju.edu.cn%2Fcas%2Foauth2.0%2FcallbackAuthorize
        return "https://zjuam.zju.edu.cn/cas/oauth2.0/authorize?".concat(new URLSearchParams(params));
    else if ('follow' in params)
        return params.follow;
    throw new Error('不支持的zjuam入口参数');
}
/**一个zjuam服务。是对fetch的包装，登录过期后会自动刷新登录
 *
 * 由于原生层会自动保存cookie，登录一旦完成，对应用的所有HTTP请求都有效。
 */
var ZjuamService = /** @class */ (function () {
    /**
     * 初始化一个服务，设置参数。调用此构造方法不会进行登录。
     *
     * 如果`refreshInSeconds`不为-1，调用`nxFetch`的方法时，若登录已过期或从未登录，则自动调用`login`登录。这可能导致突发的耗时增加。
     * @param params 服务识别参数
     * @param refreshInSeconds 登录成功后，多久后重新登录。若为-1则始终不会自动登录，需自行调用`login`方法
     * @param preserveTicket 如果为true，则不跟随zjuam登录成功的重定向（即包含ticket的重定向），需自行处理ticket
     */
    function ZjuamService(params, refreshInSeconds, preserveTicket) {
        if (refreshInSeconds === void 0) { refreshInSeconds = 60 * 30; }
        if (preserveTicket === void 0) { preserveTicket = false; }
        var _this = this;
        this.params = params;
        this.refreshInSeconds = refreshInSeconds;
        this.preserveTicket = preserveTicket;
        var rawNxFetch = fetch_1.nxFetch;
        var extendMethods = {};
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        var thisService = this;
        var _loop_1 = function (key, rawMethod) {
            extendMethods[key] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, thisService.loginIfExpired()
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                            ];
                            case 1:
                                _a.sent();
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                                return [2 /*return*/, rawMethod.apply(this, args)];
                        }
                    });
                });
            };
        };
        for (var _i = 0, _a = Object.entries(fetch_1.nxFetch); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], rawMethod = _b[1];
            _loop_1(key, rawMethod);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.nxFetch = Object.assign(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.loginIfExpired()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, rawNxFetch.apply(void 0, args)];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        }, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        extendMethods);
    }
    ZjuamService.prototype.loginIfExpired = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.refreshInSeconds !== -1 &&
                            (!this.lastLoginTime ||
                                Date.now() - this.lastLoginTime.valueOf() >=
                                    this.refreshInSeconds * 1000))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.login()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, null];
                }
            });
        });
    };
    /**立即重新登录。成功返回最终服务重定向结果url（跟随zjuam登录成功的302），失败异步抛出错误。
     *
     * 如果`preserveTicket`为true，则返回包含ticket的url。
     */
    ZjuamService.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var entryResp, postUrl, respText, execution, _a, username, password, _b, exponent, modulus, exponentBigInt, modulusBigInt, rawPassword, encPassword, loginResp, loginUrl, errorHtml, error, allowDate, allowTimestamp, waitSeconds;
            var _this = this;
            var _c, _d, _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        console.log('尝试登录服务', this);
                        return [4 /*yield*/, fetch_1.nxFetch.get(getEntryUrl(this.params), {
                                redirectChecker: function (resp) {
                                    var _a;
                                    if (_this.preserveTicket)
                                        // 停在最后包含ticket的重定向前
                                        return ((_a = resp.headers.get('location')) === null || _a === void 0 ? void 0 : _a.match(/[?&]ticket=/)) === null;
                                    else
                                        return true;
                                },
                            })
                            /**打开登录页面，zjuam重定向得到的最终地址 */
                        ];
                    case 1:
                        entryResp = _k.sent();
                        postUrl = (0, fetch_1.getRawUrl)(entryResp.url);
                        if (!postUrl.match(ZjuamService.loginUrlRegex) ||
                            postUrl.match(/[?&]ticket=/)) {
                            console.log('记住登录生效', this);
                            this.lastLoginTime = new Date();
                            return [2 /*return*/, postUrl];
                        }
                        return [4 /*yield*/, entryResp.text()];
                    case 2:
                        respText = _k.sent();
                        execution = (_d = (_c = respText.match(/<input type="hidden" name="execution" value="(?<execution>.+)"/)) === null || _c === void 0 ? void 0 : _c.groups) === null || _d === void 0 ? void 0 : _d.execution;
                        if (!execution)
                            throw new Error('获取execution失败');
                        return [4 /*yield*/, (0, credential_1.requestCredential)(this)
                            // 获取公钥
                        ];
                    case 3:
                        _a = _k.sent(), username = _a.username, password = _a.password;
                        return [4 /*yield*/, fetch_1.nxFetch.get('https://zjuam.zju.edu.cn/cas/v2/getPubKey')];
                    case 4: return [4 /*yield*/, (_k.sent()).json()];
                    case 5:
                        _b = (_k.sent()), exponent = _b.exponent, modulus = _b.modulus;
                        exponentBigInt = BigInt('0x' + exponent);
                        modulusBigInt = BigInt('0x' + modulus);
                        rawPassword = encodeAsBigInt(password);
                        encPassword = bigintModArith
                            .modPow(rawPassword, exponentBigInt, modulusBigInt)
                            .toString(16)
                            .padStart(128, '0');
                        return [4 /*yield*/, fetch_1.nxFetch.postUrlEncoded(postUrl, {
                                body: new URLSearchParams({
                                    username: username,
                                    password: encPassword,
                                    _eventId: 'submit',
                                    execution: execution,
                                    authcode: '',
                                    rememberMe: 'false',
                                }),
                                preserveMethodInRedirects: false, // 登录后若重定向则不再次发送凭据
                                redirectChecker: function (resp) {
                                    var _a;
                                    if (_this.preserveTicket)
                                        return Boolean((_a = resp.headers.get('location')) === null || _a === void 0 ? void 0 : _a.match(ZjuamService.loginUrlRegex));
                                    else
                                        return true;
                                },
                            })];
                    case 6:
                        loginResp = _k.sent();
                        loginUrl = (0, fetch_1.getRawUrl)(loginResp.url);
                        if (!loginUrl.match(ZjuamService.loginUrlRegex)) {
                            console.log('登录成功', this);
                            this.lastLoginTime = new Date();
                            return [2 /*return*/, loginUrl];
                        }
                        return [4 /*yield*/, loginResp.text()];
                    case 7:
                        errorHtml = _k.sent();
                        error = '未知错误';
                        allowDate = ((_f = (_e = errorHtml.match(/allowLoginTime\s*=\s*'(?<allowDate>.+)'/)) === null || _e === void 0 ? void 0 : _e.groups) !== null && _f !== void 0 ? _f : {}).allowDate;
                        if (allowDate) {
                            allowTimestamp = Date.parse(allowDate + '+0800').valueOf() //(上游)时区为UTC+8
                            ;
                            waitSeconds = Math.ceil((allowTimestamp - Date.now()) / 1000);
                            error = "\u5931\u8D25\u6B21\u6570\u592A\u591A\uFF0C\u8BF7\u5728 ".concat(waitSeconds, "s \u91CD\u8BD5");
                        }
                        else
                            error =
                                (_j = (_h = (_g = errorHtml.match(/<span id="msg">(?<errMsg>.*)<\/span>/)) === null || _g === void 0 ? void 0 : _g.groups) === null || _h === void 0 ? void 0 : _h.errMsg) !== null && _j !== void 0 ? _j : error;
                        console.error('登录失败', this, error, loginUrl);
                        throw new Error('登录失败: ' + error);
                }
            });
        });
    };
    ZjuamService.ctorSchema = (function () {
        var paramsSchema = zod_1.z.union([
            zod_1.z.object({ service: zod_1.z.string() }),
            zod_1.z.object({
                client_id: zod_1.z.string(),
                redirect_uri: zod_1.z.string(),
                response_type: zod_1.z.literal('code'),
            }),
            zod_1.z.object({ follow: zod_1.z.string() }),
        ]);
        return zod_1.z.union([
            zod_1.z.tuple([paramsSchema]),
            zod_1.z.tuple([paramsSchema, zod_1.z.number()]),
            zod_1.z.tuple([paramsSchema, zod_1.z.number(), zod_1.z.boolean()]),
        ]);
    })();
    ZjuamService.loginUrlRegex = /https?:\/\/zjuam\.zju\.edu\.cn/;
    return ZjuamService;
}());
exports.ZjuamService = ZjuamService;
