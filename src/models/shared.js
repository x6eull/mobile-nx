"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Term = void 0;
/**学期，支持：春/夏/秋/冬/短/春夏/秋冬 */
var Term;
(function (Term) {
    Term[Term["Spring"] = 1] = "Spring";
    Term[Term["Summer"] = 2] = "Summer";
    Term[Term["Autumn"] = 4] = "Autumn";
    Term[Term["Winter"] = 8] = "Winter";
    Term[Term["Short"] = 16] = "Short";
    Term[Term["SpringSummer"] = 3] = "SpringSummer";
    Term[Term["AutumnWinter"] = 12] = "AutumnWinter";
})(Term || (exports.Term = Term = {}));
