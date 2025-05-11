import { assert } from '@/utils/func'

export interface CourseGradeInfo {
  /**学分 */
  credit: number
  /**原始成绩。包括“缺考”、“缓考”等 */
  rawScore: string
  /**原始绩点（原样保留上游数据） */
  rawGradePoint: string
}

export interface GradeEffectiveness {
  /**这门课是否计入绩点计算。与课程本身和成绩的记录形式有关，二级制/缓考/弃修等不计绩点。
   *
   * 二级制不合格也不计绩点，但是拿不到学分（相当于未修读/弃修）。
   */
  shouldCountGradePoint: boolean
  /**是否通过。通过才可取得该课程学分。 */
  passed: boolean
}
export function getEffectiveness({
  rawScore,
}: CourseGradeInfo): GradeEffectiveness {
  assert(
    //如原始成绩不在以下范围，为未定义行为
    !!rawScore.match(
      /^(\d{1,3}|不?合格|优秀|良好|中等|不?及格|弃修|缓考|缺考|无效|零分)$/,
    ),
    'Undefined rawScore',
  )
  const numRawScore = Number.parseInt(rawScore, 10)
  return {
    shouldCountGradePoint:
      !rawScore.match(/^不?合格$/) && // 二级制，无论合格与否都不计入绩点计算
      !rawScore.match(/^(弃修|缓考)$/),
    passed: Number.isNaN(numRawScore)
      ? !!rawScore.match(/^(优秀|良好|中等|及格|合格)$/) // 文本形式
      : numRawScore >= 60, // 数字形式
  }
}
