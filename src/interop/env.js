"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNode = void 0;
exports.env = env;
exports.isNode = !import.meta.env;
if (exports.isNode)
    // 当且仅当node环境下，手动加载环境变量
    await Promise.resolve().then(function () { return require('dotenv'); }).then(function (_a) {
        var _b;
        var config = _a.config;
        ;
        (_b = [])
            .concat.apply(_b, ['.env', '.env.development'].map(function (f) { return [f, f + '.local']; })).forEach(function (file) {
            var err = config({ path: file }).error;
            if ((err === null || err === void 0 ? void 0 : err.code) === 'ENOENT')
                console.warn("".concat(file, " \u4E0D\u5B58\u5728"));
            else if (err)
                console.error(err);
            else
                console.log("\u5DF2\u52A0\u8F7D ".concat(file));
        });
    });
/**获取环境变量，支持VITE和node环境，包括vite编译后。请注意，vite只暴露VITE_开头的环境变量。 */
function env(key, autoPrefix) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    if (autoPrefix === void 0) { autoPrefix = true; }
    var viteKey = autoPrefix && !key.match(/^VITE_/i) ? "VITE_".concat(key) : key;
    var result = (_e = (_b = (_a = import.meta.env) === null || _a === void 0 ? void 0 : _a[key]) !== null && _b !== void 0 ? _b : (_d = (_c = globalThis.process) === null || _c === void 0 ? void 0 : _c.env) === null || _d === void 0 ? void 0 : _d[key]) !== null && _e !== void 0 ? _e : null;
    if (result === null && viteKey !== key)
        result =
            (_k = (_g = (_f = import.meta.env) === null || _f === void 0 ? void 0 : _f[viteKey]) !== null && _g !== void 0 ? _g : (_j = (_h = globalThis.process) === null || _h === void 0 ? void 0 : _h.env) === null || _j === void 0 ? void 0 : _j[viteKey]) !== null && _k !== void 0 ? _k : null;
    return result;
}
