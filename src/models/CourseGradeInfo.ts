export interface CourseGradeInfo {
  /**学分 */
  credit: number
  /**原始成绩。包括“缺考”、“缓考”等 */
  rawScore: string
  /**原始绩点（原样保留上游数据） */
  rawGradePoint: string
  /**是否弃修 */
  isAborted: boolean
}
