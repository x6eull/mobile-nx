"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.nxFetch = void 0;
exports.getRawUrl = getRawUrl;
var core_1 = require("@capacitor/core");
var _1 = require(".");
var env_1 = require("./env");
require("../utils/extendHeaders");
var cookieJar = null;
// node环境不会自动保存cookie，手动跟踪
if (env_1.isNode) {
    console.warn('检测到node环境，导入tough-cookie');
    cookieJar = new (await Promise.resolve().then(function () { return require('tough-cookie'); })).CookieJar();
}
/**将Headers或URLSearchParams转换为对象字面量。注意：同名header将被覆盖 */
function toLiteral(from) {
    var result = {};
    for (var _i = 0, _a = from.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], k = _b[0], v = _b[1];
        result[k] = v;
    }
    return result;
}
function nxFetchBase(input_1, init_1) {
    return __awaiter(this, arguments, void 0, function (input, init, 
    /**剩余允许的重定向次数。0表示不允许重定向。
     *
     * **此参数仅在capacitor/node上支持**，若超过重定向次数返回最后一次响应，不报错。
     */
    redirectLeft) {
        function checkRedirect(resp) {
            var _a;
            if ([301, 302, 303, 307, 308].includes(resp.status) && redirectLeft > 0) {
                if (((_a = init === null || init === void 0 ? void 0 : init.redirectChecker) === null || _a === void 0 ? void 0 : _a.call(init, resp)) === false)
                    return null;
                redirectLeft--;
                var location_1 = resp.headers.get('location');
                if (!location_1)
                    throw new Error('Redirect without location header');
                if (!preserveMethodInRedirects || resp.status === 303)
                    // 转为GET
                    return (0, exports.nxFetch)(location_1, {
                        method: 'GET',
                        preserveMethodInRedirects: preserveMethodInRedirects,
                        headers: toLiteral(h),
                    }, redirectLeft);
                //保留原始请求方法和正文 但移除cookie和authorization
                h.delete('cookie');
                h.delete('authorization');
                return (0, exports.nxFetch)(location_1, { method: method, body: body, preserveMethodInRedirects: preserveMethodInRedirects, headers: toLiteral(h) }, redirectLeft);
            }
            return null;
        }
        var _a, method, reqHeaders, body, _b, preserveMethodInRedirects, h, c, resp_1, r_1, b, randomArr, boundary, _c, respUrl, respData, status, respHeaders, r, result;
        if (redirectLeft === void 0) { redirectLeft = 10; }
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = init !== null && init !== void 0 ? init : {}, method = _a.method, reqHeaders = _a.headers, body = _a.body, _b = _a.preserveMethodInRedirects, preserveMethodInRedirects = _b === void 0 ? true : _b;
                    h = new Headers(reqHeaders);
                    //添加默认UA
                    h.setDefault('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.0');
                    h.setDefault('accept', '*/*');
                    h.setDefault('accept-language', 'zh-CN,zh;q=0.9,en;q=0.8');
                    if (!cookieJar) return [3 /*break*/, 4];
                    c = cookieJar.getCookieStringSync(input);
                    if (c)
                        h.append('cookie', c);
                    return [4 /*yield*/, globalThis.fetch(input, __assign(__assign({}, init), { headers: h, redirect: 'manual' }))];
                case 1:
                    resp_1 = _d.sent();
                    resp_1.headers
                        .getSetCookie()
                        .forEach(function (s) { return cookieJar.setCookieSync(s, resp_1.url); });
                    r_1 = checkRedirect(resp_1);
                    if (!r_1) return [3 /*break*/, 3];
                    return [4 /*yield*/, r_1];
                case 2: return [2 /*return*/, _d.sent()];
                case 3: return [2 /*return*/, resp_1];
                case 4:
                    if (!(_1.appPlatform === 'web')) return [3 /*break*/, 6];
                    return [4 /*yield*/, globalThis.fetch(input, init)];
                case 5: 
                //TODO 用本地开发服务器代理请求
                return [2 /*return*/, _d.sent()];
                case 6:
                    b = body;
                    if (body instanceof URLSearchParams) {
                        h.set('content-type', 'application/x-www-form-urlencoded');
                        b = toLiteral(body);
                    }
                    else if (body instanceof FormData) {
                        randomArr = new Uint8Array(12);
                        crypto.getRandomValues(randomArr);
                        boundary = "----".concat(__spreadArray([], randomArr.values(), true).map(function (v) { return v.toString(36); }).join(''));
                        h.set('content-type', "multipart/form-data;boundary=".concat(boundary));
                        //capacitor仅支持一种特殊格式的数组
                        b = __spreadArray([], body.entries(), true).map(function (_a) {
                            var key = _a[0], value = _a[1];
                            if (typeof value === 'string')
                                return { type: 'string', key: key, value: value };
                            //TODO 支持File (type: 'base64File')
                            throw new TypeError("Unsupported field ".concat(key, " in FormData"));
                        });
                    }
                    else if (typeof body !== 'string' && body !== undefined)
                        throw new TypeError('Unsupported body type');
                    return [4 /*yield*/, core_1.CapacitorHttp.request({
                            url: input,
                            method: method,
                            headers: toLiteral(h),
                            responseType: 'text',
                            data: b,
                            dataType: body instanceof FormData ? 'formData' : undefined,
                            disableRedirects: true, // 即使设为false也无法自动重定向
                        })];
                case 7:
                    _c = (_d.sent()), respUrl = _c.url, respData = _c.data, status = _c.status, respHeaders = _c.headers;
                    r = checkRedirect(new Response(null, { headers: respHeaders, status: status }));
                    if (!r) return [3 /*break*/, 9];
                    return [4 /*yield*/, r]; //重定向
                case 8: return [2 /*return*/, _d.sent()]; //重定向
                case 9:
                    if (typeof respData === 'string')
                        result = new Response(respData, { headers: respHeaders, status: status });
                    else if (respData === null)
                        result = new Response(null, { headers: respHeaders, status: status });
                    else if (typeof respData === 'object' &&
                        Reflect.getPrototypeOf(respData) === Object.prototype)
                        // json字面量
                        result = Response.json(respData, { headers: respHeaders, status: status });
                    else
                        throw new TypeError('Unsupported response data type');
                    Reflect.defineProperty(result, 'url', {
                        configurable: true,
                        enumerable: true,
                        value: respUrl,
                        writable: false,
                    });
                    return [2 /*return*/, result];
            }
        });
    });
}
var nxFetchExtend = {
    // 目前不再暴露CapacitorHttp.request
    // request: CapacitorHttp.request.bind(CapacitorHttp),
    get: function (url, init) {
        return this(url, init);
    },
    postJson: function (url, init) {
        var body = init.body, headers = init.headers, otherProps = __rest(init, ["body", "headers"]);
        var h = new Headers(headers);
        /** https://www.iana.org/assignments/media-types/application/json
         *  Note:  No "charset" parameter is defined for this registration.
         *  Adding one really has no effect on compliant recipients. */
        h.set('Content-Type', 'application/json');
        return this(url, __assign({ method: 'POST', headers: toLiteral(h), body: JSON.stringify(body) }, otherProps));
    },
    /**发送POST请求，Content-Type: application/x-www-form-urlencoded */
    postUrlEncoded: function (url, init) {
        return this(url, __assign({ method: 'POST' }, init));
    },
    /**发送POST请求，Content-Type: multipart/form-data,boundary=... */
    postFormData: function (url, init) {
        return this(url, __assign({ method: 'POST' }, init));
    },
};
/**http请求方法集合。有native支持时无视跨域限制。
 *
 * 在所有平台上都会自动记录cookie并按标准附带，无法单独控制。
 */
exports.nxFetch = Object.assign(nxFetchBase, nxFetchExtend);
/**TODO 此函数或将弃用 */
function getRawUrl(interceptedUrl) {
    //解析http://192.168.0.100:8100/_capacitor_http_interceptor_?u=https%3A%2F%2Fzjuam.zju.edu.cn%2Fcas%2Flogin%3Fservice%3Dhttp%253A%252F%252Fzdbk.zju.edu.cn%252Fjwglxt%252Fxtgl%252Flogin_ssologin.html
    var url = new URL(interceptedUrl);
    if (url.pathname === '/_capacitor_http_interceptor_')
        return url.searchParams.get('u');
    return interceptedUrl;
}
if ((_a = import.meta.env) === null || _a === void 0 ? void 0 : _a.DEV) {
    // vite开发环境下，把nxFetch等暴露到全局对象上以便调试
    function getPropertyDescriptor(value) {
        return {
            configurable: true,
            enumerable: false,
            value: value,
        };
    }
    var exposedProperties = {
        nxFetch: getPropertyDescriptor(exports.nxFetch),
        CapacitorCookies: getPropertyDescriptor(core_1.CapacitorCookies),
    };
    Object.defineProperties(globalThis, exposedProperties);
    console.warn('DEV mode: properties exposed', exposedProperties);
}
