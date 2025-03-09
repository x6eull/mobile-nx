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
exports.GetCourse = void 0;
var shared_1 = require("./models/shared");
var zjuam_1 = require("./interop/zjuam");
var GetCourse = /** @class */ (function () {
    function GetCourse() {
        this.zjuamService = new zjuam_1.ZjuamService({ service: 'http://zdbk.zju.edu.cn/jwglxt/xtgl/login_ssologin.html' }, 60 * 30);
    }
    /**
     * 合并课程并去重的函数
     * 合并原则：
     * 1. 当且仅当两课程ID相同且时间连续时，会进行合并。
     * 2. 对于内容完全相同的课程，仅保留一个。
     * 3. 对于ID相同但时间不连续或地点不同的课程，将它们合并到同一个课程对象的classes数组中。
     */
    GetCourse.prototype.mergeAndDeduplicateCourses = function (courseList) {
        // 按照课程ID排序，如果ID相同，则按照classes中的startSection排序
        courseList.sort(function (a, b) {
            if (a.id < b.id)
                return -1;
            if (a.id > b.id)
                return 1;
            // 如果ID相同，比较startSection
            return a.classes[0].startSection - b.classes[0].startSection;
        });
        var _loop_1 = function (course) {
            // 对每个课程的classes按startSection排序
            course.classes.sort(function (a, b) { return a.startSection - b.startSection; });
            // 删除重复的ClassArrangement
            var lastClass = null;
            course.classes = course.classes.filter(function (currentClass) {
                if (lastClass &&
                    lastClass.dayOfWeek === currentClass.dayOfWeek &&
                    lastClass.startSection === currentClass.startSection &&
                    lastClass.sectionCount === currentClass.sectionCount &&
                    lastClass.location === currentClass.location &&
                    lastClass.weekType === currentClass.weekType) {
                    // 如果与上一项完全相同，跳过
                    return false;
                }
                lastClass = currentClass;
                return true;
            });
        };
        // 第一步：删除重复的ClassArrangement
        for (var _i = 0, courseList_1 = courseList; _i < courseList_1.length; _i++) {
            var course = courseList_1[_i];
            _loop_1(course);
        }
        // 第二步：合并课程
        var mergedCourses = [];
        var _loop_2 = function (currentCourse) {
            // 找到当前课程是否已经存在于mergedCourses中
            var existingCourse = mergedCourses.find(function (c) { return c.id === currentCourse.id; });
            if (!existingCourse) {
                // 如果不存在，直接添加到mergedCourses
                mergedCourses.push(currentCourse);
            }
            else {
                // 如果存在，合并课程信息
                existingCourse.classes = existingCourse.classes.concat(currentCourse.classes);
                // 再次对合并后的classes去重
                existingCourse.classes.sort(function (a, b) { return a.startSection - b.startSection; });
                var lastClass_1 = null;
                existingCourse.classes = existingCourse.classes.filter(function (currentClass) {
                    if (lastClass_1 &&
                        lastClass_1.dayOfWeek === currentClass.dayOfWeek &&
                        lastClass_1.startSection === currentClass.startSection &&
                        lastClass_1.sectionCount === currentClass.sectionCount &&
                        lastClass_1.location === currentClass.location &&
                        lastClass_1.weekType === currentClass.weekType) {
                        // 如果与上一项完全相同，跳过
                        return false;
                    }
                    lastClass_1 = currentClass;
                    return true;
                });
            }
        };
        for (var _a = 0, courseList_2 = courseList; _a < courseList_2.length; _a++) {
            var currentCourse = courseList_2[_a];
            _loop_2(currentCourse);
        }
        // 第三步：合并连续的ClassArrangement
        for (var _b = 0, mergedCourses_1 = mergedCourses; _b < mergedCourses_1.length; _b++) {
            var course = mergedCourses_1[_b];
            course.classes.sort(function (a, b) { return a.startSection - b.startSection; });
            var i = 0;
            while (i < course.classes.length - 1) {
                var currentClass = course.classes[i];
                var nextClass = course.classes[i + 1];
                // 如果连续且地点相同，合并节次
                if (currentClass.dayOfWeek === nextClass.dayOfWeek &&
                    currentClass.weekType === nextClass.weekType &&
                    currentClass.location === nextClass.location &&
                    currentClass.startSection + currentClass.sectionCount ===
                        nextClass.startSection) {
                    currentClass.sectionCount += nextClass.sectionCount;
                    course.classes.splice(i + 1, 1); // 删除合并后的下一个ClassArrangement
                }
                else {
                    i++;
                }
            }
        }
        return mergedCourses;
    };
    /**
     * 提取课程信息的函数，主要作用是对返回的数据进行处理，并转换成我们需要的course格式
     */
    GetCourse.prototype.extractClassInfo = function (data) {
        var classInfo = [];
        if (!data || !data.kbList || !Array.isArray(data.kbList)) {
            throw new Error('Invalid data format or missing kbList:');
        }
        var kbList = data.kbList;
        for (var i = 0; i < kbList.length; i++) {
            var item = kbList[i];
            var kcb = item.kcb, dsz = item.dsz, djj = item.djj, xqj = item.xqj, xxq = item.xxq, xkkh = item.xkkh, skcd = item.skcd;
            if (!kcb) {
                throw new Error('kcb field is missing in one of the items');
            }
            var kcbItem = kcb.split('<br>');
            var className = kcbItem[0];
            var classTeacherName = kcbItem[2];
            var classLocation = kcbItem[3];
            classLocation = classLocation.replace(/zwf.*/, '').trim();
            var termIdMap = {
                春: shared_1.Term.Spring,
                夏: shared_1.Term.Summer,
                秋: shared_1.Term.Autumn,
                冬: shared_1.Term.Winter,
                短: shared_1.Term.Short,
            };
            var termId = 0;
            for (var j = 0; j < xxq.length; j++) {
                var season = xxq[j];
                if (season in termIdMap) {
                    termId |= termIdMap[season];
                }
                else {
                    throw new Error("\u5B66\u671F\u5339\u914D\u5931\u8D25");
                }
            }
            var semester = {
                year: parseInt(data.xnm.split('-')[0], 10),
                term: termId,
            };
            var weekType = dsz === '0' ? 'odd' : dsz === '1' ? 'even' : 'every';
            var classArrangement = {
                weekType: weekType,
                dayOfWeek: xqj,
                startSection: parseInt(djj, 10),
                sectionCount: parseInt(skcd, 10),
                location: classLocation,
            };
            var course = {
                semester: semester,
                id: xkkh,
                name: className,
                teacherName: classTeacherName,
                classes: [classArrangement],
            };
            classInfo.push(course);
        }
        return classInfo;
    };
    /**
     * 获取指定学号在指定学年范围内的所有课程表信息
     */
    GetCourse.prototype.getTimetable = function (userid, xnmStart, xnmEnd) {
        return __awaiter(this, void 0, void 0, function () {
            var url, semesters, allCourses, xnm, yearCode, _i, semesters_1, _a, xqm, xqmmc, params, response, responseData, classInfo;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = "http://zdbk.zju.edu.cn/jwglxt/kbcx/xskbcx_cxXsKb.html?gnmkdm=N253508&su=".concat(userid);
                        semesters = [
                            { xqm: '1|秋', xqmmc: '秋' },
                            { xqm: '1|冬', xqmmc: '冬' },
                            { xqm: '2|春', xqmmc: '春' },
                            { xqm: '2|夏', xqmmc: '夏' },
                            { xqm: '2|短', xqmmc: '短' },
                        ];
                        allCourses = [];
                        xnm = parseInt(xnmStart);
                        _b.label = 1;
                    case 1:
                        if (!(xnm <= parseInt(xnmEnd))) return [3 /*break*/, 7];
                        yearCode = "".concat(xnm, "-").concat(xnm + 1);
                        _i = 0, semesters_1 = semesters;
                        _b.label = 2;
                    case 2:
                        if (!(_i < semesters_1.length)) return [3 /*break*/, 6];
                        _a = semesters_1[_i], xqm = _a.xqm, xqmmc = _a.xqmmc;
                        params = new URLSearchParams({
                            xnm: yearCode,
                            xqm: xqm,
                            xqmmc: xqmmc,
                            xxqf: '0',
                            xxfs: '0',
                        });
                        return [4 /*yield*/, this.zjuamService.nxFetch.postUrlEncoded(url, {
                                body: params,
                            })];
                    case 3:
                        response = _b.sent();
                        if (!response.ok) {
                            throw new Error("Failed to fetch data for ".concat(yearCode, " ").concat(xqmmc, ". Status: ").concat(response.status));
                        }
                        return [4 /*yield*/, response.json()];
                    case 4:
                        responseData = (_b.sent());
                        classInfo = this.extractClassInfo(responseData);
                        allCourses = allCourses.concat(classInfo); // 收集所有课程
                        _b.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6:
                        xnm++;
                        return [3 /*break*/, 1];
                    case 7: 
                    // 在所有课程收集完成后，统一进行去重和合并
                    return [2 /*return*/, this.mergeAndDeduplicateCourses(allCourses)];
                }
            });
        });
    };
    return GetCourse;
}());
exports.GetCourse = GetCourse;
