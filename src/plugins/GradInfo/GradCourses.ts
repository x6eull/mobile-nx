// src/plugins/GradInfo/GradCourses.ts
import axios from 'axios';
import { getToken } from './TokenService';
import { Course, ClassArrangement, ExamArrangement, DayOfWeek, WeekOfSemester } from '../../models/Course';

export async function fetchGradClass(academicYear: string, semester: string): Promise<Course[] | null> {
  const token = await getToken();
  if (!token) {
    console.error('Failed to get token');
    return null;
  }

  const api_url = "https://yjsy.zju.edu.cn/dataapi/py/pyKcbj/queryXskbByLoginUser";
  const timestamp = Date.now();

  try {
    const response = await axios.get(api_url, {
      params: {
        _t: timestamp,
        xn: academicYear,
        pkxq: semester
      },
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.success) {
      const courseInfo = response.data.result.kcbMap;

      if (Object.keys(courseInfo).length === 0) {
        console.error('No course data found in kcbMap');
        return [];
      }

      const courses: Course[] = [];

      for (const [weekday, weekdayCourses] of Object.entries(courseInfo)) {
        for (const [period, periodCourses] of Object.entries(weekdayCourses)) {
          if (periodCourses.pyKcbjSjddVOList.length === 0) {
            console.error('No course data found in pyKcbjSjddVOList for weekday:', weekday, 'period:', period);
            continue;
          }

          periodCourses.pyKcbjSjddVOList.forEach((courseData: any) => {
            let weekType: 'odd' | 'even' | 'every' | WeekOfSemester = 'every';
            if (courseData.dsz === '10') {
              weekType = 'every';
            } else if (courseData.dszMc) {
              weekType = courseData.dszMc.toLowerCase() as 'odd' | 'even';
            }

            const dayOfWeek = parseInt(weekday, 10) as DayOfWeek;
            const startSection = courseData.ksjc;
            const sectionCount = courseData.jsjc - courseData.ksjc + 1;
            const location = courseData.cdmc;

            const classArrangement: ClassArrangement = {
              weekType,
              dayOfWeek,
              startSection,
              sectionCount,
              location
            };

            const course: Course = {
              semester: `${academicYear}-${semester}`,
              id: courseData.kcbjId,
              name: courseData.kcmc,
              credit: 0, // 课程学分可能需要从其他地方获取
              teacherName: courseData.xm,
              classes: [classArrangement],
              exams: [] // 考试信息可能需要从其他地方获取
            };

            courses.push(course);
          });
        }
      }

      return courses;
    } else {
      console.error('Failed to fetch course information:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('Error fetching course information:', error);
    return null;
  }
}
