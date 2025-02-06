# 研究生院相关模块说明

## 1. 获取 Token (getToken)
获取访问浙江大学研究生院系统（yjsy.zju.edu.cn）API所需的Token。Token是访问浙江大学研究生院API接口的必要凭证，用于身份验证和授权。

### 输入参数
- 不接受任何输入参数。它会自动从项目的`.env.local`文件中读取用户名和密码，并通过`requestCredential`函数获取登录凭证。

### 返回结果
- 成功时：返回一个`string`类型的Token，用于后续API接口的调用。
- 失败时：返回`null`，并打印错误信息到控制台。

### 函数逻辑
1. 加载环境变量：通过`dotenv`库加载`.env.local`文件中的环境变量，获取用户名和密码。
2. 请求登录凭证：调用`requestCredential`函数，从环境变量中读取用户名和密码。
3. 登录浙大统一身份认证系统：
   - 使用`ZjuamService`创建一个登录服务实例。
   - 调用`service.login()`方法，通过浙大统一身份认证系统登录，并获取登录后的URL。
4. 提取票据（Ticket）：
   - 从登录后的URL中提取`ticket`参数。
   - 如果未获取到`ticket`，返回`null`。
5. 验证票据并获取Token：
   - 使用`ticket`调用`validateLogin`接口，验证票据的有效性。

### 测试方法
在 `local.test.ts` 中调用 `getToken` 函数，查看返回的Token。

```typescript
const token = await getToken();
if (token) {
  console.log('Token:', token);
} else {
  console.error('Failed to get token');
}
```

## 2. 获取课程信息 (fetchGradClass)
该模块用于获取指定学年和学期的研究生课程信息。

### 输入参数
- `academicYear`: string - 学年
- `semester`: string - 学期
  - 11 - 春学期；12 - 夏学期；13 - 秋学期；14 - 冬学期

### 返回结果
- 返回一个 `Course[]` 数组，包含课程的基本信息、上课时间、地点等。
- 如果获取失败，返回 `null`。

### 数据结构
```typescript
interface Course {
  semester: string; // 学期，格式为 "学年-学期"
  id: string; // 课程 ID
  name: string; // 课程名称
  credit: number; // 课程学分
  teacherName: string; // 教师姓名
  classes: ClassArrangement[]; // 上课安排
  exams: ExamArrangement[]; // 考试安排
}

interface ClassArrangement {
  weekType: 'odd' | 'even' | 'every' | WeekOfSemester; // 周类型：单周、双周、每周
  dayOfWeek: DayOfWeek; // 星期几
  startSection: number; // 开始节次
  sectionCount: number; // 节次数量
  location: string; // 上课地点
}
```

### 测试方法
在 `local.test.ts` 中调用 `fetchGradClass` 函数，传入学年和学期参数，查看返回的课程信息。

```typescript
const academicYear = "2024"; // 2024学年
const semester = "14"; // 冬学期
const courseInfo = await fetchGradClass(academicYear, semester);
if (courseInfo) {
  console.log('Course Information:', JSON.stringify(courseInfo, null, 2));
} else {
  console.error('Failed to fetch course information');
}
```

### 问题
研究生课表的那个api里好像没有返回学分的，所以这里的学分就都空着了。

## 3. 获取成绩信息 (fetchGradGrades)
该模块用于获取研究生所有成绩信息。

### 输入参数
- `academicYear`: string - 学年，例如 "2024"。
- `semester`: string - 学期，例如 "14"（冬学期）。

### 返回结果
- 返回一个 `Grade[]` 数组，包含课程成绩、学分等信息。
- 如果获取失败，返回 `null`。

### 数据结构
```typescript
interface Grade {
  course: {
    semester: string; // 学期，格式为 "学年-学期"
    id: string; // 课程 ID
    name: string; // 课程名称
    credit: number; // 课程学分
  };
  rawScore: string; // 原始成绩
  rawGradePoint: string; // 原始绩点
  isAborted: boolean; // 是否弃修
}
```

### 测试方法
在 `local.test.ts` 中调用 `fetchGrades` 函数，传入学年和学期参数，查看返回的成绩信息。

```typescript
const academicYear = "2024"; // 2024学年
const semester = "14"; // 冬学期
const gradesInfo = await fetchGrades(academicYear, semester);
if (gradesInfo) {
  console.log('Grades Information:', JSON.stringify(gradesInfo, null, 2));
} else {
  console.error('Failed to fetch grades information');
}
```

### 问题
1. 研究生没有绩点信息。全部赋值0.0了。
2. 这个课程api虽然请求的时候可以带学年学期，但是返回的时候一直都是全部成绩（?）没法按照真实修读的学年学期返回。

## 4. 获取学生信息 (fetchStudentInfo)
该模块用于获取当前登录研究生的基本信息、学分信息以及培养方案信息。

### 输入参数
- 无

### 返回结果
- 返回一个 `StudentInfo` 对象，包含学生的基本信息、总学分、已获得学分、培养方案环节等信息。
- 如果获取失败，返回 `null`。

### 数据结构
```typescript
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
```

### 测试方法
在 `local.test.ts` 中调用 `fetchStudentInfo` 函数，查看返回的学生信息。

```typescript
const studentInfo = await fetchStudentInfo();
if (studentInfo) {
  console.log('Student Information:', JSON.stringify(studentInfo, null, 2));
} else {
  console.error('Failed to fetch student information');
}
```

## 测试方法

### 环境变量配置
在根目录下创建 `.env.local` 文件，配置用户名和密码：
```
VITE_USERNAME=用户名
VITE_PASSWORD=密码
```

### 示例测试脚本
```typescript
// local.test.ts
import { config } from 'dotenv';
config({ path: '.env.local' });

import { fetchGradClass } from './src/services/GradInfo/GradCourses';
import { fetchGradGrades } from './src/services/GradInfo/GradGrades';
import { fetchStudentInfo } from './src/services/GradInfo/GradStuInfo'; // 导入 fetchStudentInfo

(async () => {
  const academicYear = "2023"; // 2024学年
  const semester = "11"; // 冬学期
  // 11春学期；12夏学期；13秋学期；14冬学期

  // 测试获取课程信息
  console.log('Testing fetchGradClass...');
  const courseInfo = await fetchGradClass(academicYear, semester);
  if (courseInfo) {
    console.log('Course Information:', JSON.stringify(courseInfo, null, 2));
  } else {
    console.error('Failed to fetch course information');
  }

  // 测试获取成绩信息
  console.log('Testing fetchGrades...');
  const gradesInfo = await fetchGradGrades(academicYear, semester);
  if (gradesInfo) {
    console.log('Grades Information:', JSON.stringify(gradesInfo, null, 2));
  } else {
    console.error('Failed to fetch grades information. This might be due to network issues or an invalid URL. Please check the URL validity and try again.');
  }

  // 测试获取学生信息
  console.log('Testing fetchStudentInfo...');
  const studentInfo = await fetchStudentInfo();
  if (studentInfo) {
    console.log('Student Information:', JSON.stringify(studentInfo, null, 2));
  } else {
    console.error('Failed to fetch student information. This might be due to network issues or an invalid URL. Please check the URL validity and try again.');
  }
})();
```
