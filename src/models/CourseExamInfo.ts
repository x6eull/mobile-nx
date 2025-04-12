/**课程考试信息。 */
export interface CourseExamInfo {
  /**考试 */
  exams: ExamArrangement[]
}

export type ExamType = 'midterm' | 'final'
/**单场考试安排 */
export interface ExamArrangement {
  type: ExamType
  startAt: Date
  endAt: Date
  /**考试地点，可空 */
  location?: string
  /**座位号，可空，原样保留上游结果，不需要转Number再转字符串 */
  seat?: string
}
