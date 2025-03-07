// 既然用0b了为什么不干脆把位运算也整上捏
import { Semester, Term } from '@/models/shared'

const stupidMap = {
  [Term.Spring]: [2, '春'],
  [Term.Summer]: [2, '夏'],
  [Term.Autumn]: [1, '秋'],
  [Term.Winter]: [1, '冬'],
  [Term.SpringSummer]: [2, ''],
  [Term.AutumnWinter]: [1, ''],
  [Term.Short]: [1, '短'],
}

export const prepareSemesterString = (Semester: Semester): [string, string] => {
  return [
    `${Semester.year}-${Semester.year + 1}-${stupidMap[Semester.term][0]}-`,
    stupidMap[Semester.term][1] as string,
  ]
}
