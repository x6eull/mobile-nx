// src/plugins/GradInfo/GradStuInfo.ts
import axios from 'axios';
import { getToken } from './TokenService';

// 定义返回的数据结构
interface StudentInfo {
  totalCredits: number; // 总学分
  earnedCredits: number; // 已获得学分
  studentBasicInfo: {
    id: string; // 学生 ID
    studentNumber: string; // 学号
    name: string; // 姓名
    grade: string; // 年级
    majorName: string; // 专业名称
    academyName: string; // 学院名称
    trainingTypeName: string; // 培养类型名称
    directionName: string; // 培养方案研究方向名称
    advisorName: string; // 导师姓名
  };
  trainingPlanSections: Array<{
    sectionName: string; // 环节名称
    requiredCredits: number; // 该环节要求的学分
    earnedCredits: number; // 已获得的学分
  }>;
}

export async function fetchStudentInfo(): Promise<StudentInfo | null> {
  const token = await getToken();
  if (!token) {
    console.error('Failed to get token');
    return null;
  }

  const api_url = "https://yjsy.zju.edu.cn/dataapi/py/pyXsxk/getXsxkXfInfoByXs";

  try {
    const response = await axios.post(api_url, {}, {
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.success) {
      const result = response.data.result;

      const studentInfo: StudentInfo = {
        totalCredits: result.zxf, // 总学分
        earnedCredits: result.yhzxf, // 已获得学分
        studentBasicInfo: {
          id: result.xjYjsjbxx.id, // 学生 ID
          studentNumber: result.xjYjsjbxx.xh, // 学号
          name: result.xjYjsjbxx.xm, // 姓名
          grade: result.xjYjsjbxx.nj, // 年级
          majorName: result.xjYjsjbxx.zyMc, // 专业名称
          academyName: result.xjYjsjbxx.yxMc, // 学院名称
          trainingTypeName: result.xjYjsjbxx.pylxMc, // 培养类型名称
          directionName: result.xjYjsjbxx.pyfaYjfxMc, // 培养方案研究方向名称
          advisorName: result.xjYjsjbxx.dsxm, // 导师姓名
        },
        trainingPlanSections: result.pyPyfaHjList.map((section: any) => ({
          sectionName: section.hj, // 环节名称
          requiredCredits: section.xf, // 该环节要求的学分
          earnedCredits: section.yhxf, // 已获得的学分
        }))
      };

      return studentInfo;
    } else {
      console.error('Failed to fetch student information:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('Error fetching student information:', error);
    return null;
  }
}
