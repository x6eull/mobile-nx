// src/plugins/GradInfo/GradGrades.ts
import axios from 'axios';
import { getToken } from './TokenService';
import { Grade, Course } from '../../models/Grade';

export async function fetchGradGrades(academicYear: string, semester: string): Promise<Grade[] | null> {
  const token = await getToken();
  if (!token) {
    console.error('Failed to get token');
    return null; // 如果获取 token 失败，直接返回 null
  }

  const api_url = "https://yjsy.zju.edu.cn/dataapi/py/pyXsxk/queryXsxkByXnxqXs";

  try {
    const response = await axios.post(api_url, {}, {
      params: {
        xn: academicYear,
        xq: semester
      },
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.success) {
      const result = response.data.result;
      const grades: Grade[] = [];

      if (result?.xxjhnList) {
        result.xxjhnList.forEach((item: any) => {
          const course: Pick<Course, 'semester' | 'id' | 'name' | 'credit'> = {
            semester: `${item.xn}-${item.xq}`, // 学年-学期
            id: item.kckId, // 课程库 ID
            name: item.kcmc, // 课程名称
            credit: item.xf // 学分
          };

          const grade: Grade = {
            course,
            rawScore: item.zf !== null ? item.zf.toString() : item.xkztMc, // 原始成绩
            rawGradePoint: '0.0', // 统一赋值为 0.0
            isAborted: item.xkzt === '11' // 是否弃修（11 表示未选）
          };

          grades.push(grade);
        });
      }

      return grades;
    } else {
      console.error('Failed to fetch grades information:', response.data.message);
      return null; // 如果 API 请求失败，返回 null
    }
  } catch (error) {
    console.error('Error fetching grades information:', error);
    return null; // 如果发生错误，返回 null
  }
}
