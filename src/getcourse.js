const DayOfWeek = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
};

const Term = {
  Spring: 0b1,
  Summer: 0b10,
  Autumn: 0b100,
  Winter: 0b1000,
  Short: 0b10000,
  SpringSummer: 0b11,
  AutumnWinter: 0b1100,
};

// 课程信息
function Course(semester, id, name, credit, teacherName, classes) {
  this.semester = semester;
  this.id = id;
  this.name = name;
  this.credit = credit;
  this.teacherName = teacherName;
  this.classes = classes || [];
}

// 上课时间安排
function ClassArrangement(weekType, dayOfWeek, startSection, sectionCount, location) {
  this.weekType = weekType;
  this.dayOfWeek = dayOfWeek;
  this.startSection = startSection;
  this.sectionCount = sectionCount;
  this.location = location;
}

// 合并课程的函数
function mergeCourses(courseList) {
  // 首先对课程列表进行排序
  courseList.sort((a, b) => {
    if (a.id !== b.id) return a.id.localeCompare(b.id);
    if (a.classes[0].dayOfWeek !== b.classes[0].dayOfWeek) return a.classes[0].dayOfWeek - b.classes[0].dayOfWeek;
    return a.classes[0].startSection - b.classes[0].startSection;
  });

  const mergedCourses = [];
  for (let i = 0; i < courseList.length; i++) {
    let currentCourse = courseList[i];
    while (
      i + 1 < courseList.length &&
      currentCourse.id === courseList[i + 1].id &&
      currentCourse.classes[0].location === courseList[i + 1].classes[0].location &&
      currentCourse.classes[0].dayOfWeek === courseList[i + 1].classes[0].dayOfWeek &&
      currentCourse.classes[0].weekType === courseList[i + 1].classes[0].weekType &&
      currentCourse.classes[0].startSection + currentCourse.classes[0].sectionCount === courseList[i + 1].classes[0].startSection
    ) {
      // 合并课程
      currentCourse.classes[0].sectionCount += courseList[i + 1].classes[0].sectionCount;
      i++;
    }
    mergedCourses.push(currentCourse);
  }
  return mergedCourses;
}

// 去重函数
function removeDuplicates(courseList) {
  const uniqueCourses = [];
  const seenCourses = new Set();

  courseList.forEach((course) => {
    const courseKey = `${course.id}-${course.classes[0].dayOfWeek}-${course.classes[0].startSection}-${course.classes[0].location}-${course.classes[0].weekType}-${course.classes[0].sectionCount}`;
    if (!seenCourses.has(courseKey)) {
      seenCourses.add(courseKey);
      uniqueCourses.push(course);
    }
  });

  return uniqueCourses;
}

// 获取课程表
function getTimetable(userid, cookies, data) {
  function extractClassInfo(data) {
    const classInfo = [];
    const termIdMap = { 春: "Spring", 夏: "Summer", 秋: "Autumn", 冬: "Winter" };

    if (!data || !data.kbList || !Array.isArray(data.kbList)) {
      console.error("Invalid data format or missing kbList:", data);
      return classInfo;
    }

    const kbList = data.kbList;

    for (let i = 0; i < kbList.length; i++) {
      const item = kbList[i];
      const { kcb, dsz, djj, xqj, xxq, sfqd, jszgh, xkkh, skcd, skjc, skdd } = item;

      if (!kcb) {
        console.error("kcb field is missing in one of the items:", item);
        continue;
      }

      const kcbItem = kcb.split("<br>");
      const className = kcbItem[0];
      const classTeacherName = kcbItem[2];
      let classLocation = kcbItem[3];

      // 如果地点包含 "zwf"，只保留 "zwf" 之前的部分
      if (classLocation.includes("zwf")) {
        classLocation = classLocation.split("zwf")[0].trim();
      }

      let termId = 0;
      for (let j = 0; j < xxq.length; j++) {
        const season = xxq[j];
        if (termIdMap[season]) {
          termId |= Term[termIdMap[season]];
        }
      }

      const semester = {
        year: parseInt(data.xnm.split("-")[0], 10), // 取学年区间较小者
        term: termId,
      };

      const weekType = dsz === "0" ? "odd" : dsz === "1" ? "even" : "every"; // 教务网中，0代表单周，1代表双周，2代表每周

      const classArrangement = new ClassArrangement(
        weekType,
        DayOfWeek[xqj], // 星期几
        parseInt(djj, 10), // 开始节次
        parseInt(skcd, 10), // 持续节数
        classLocation // 地点（处理过 "zwf" 的情况）
      );

      const course = new Course(
        semester,
        xkkh, // 选课号
        className, // 课程名称
        0, // 学分暂未获取
        classTeacherName, // 教师姓名
        [classArrangement] // 上课时间地点
      );

      classInfo.push(course);
    }

    return classInfo;
  }

  const url = `http://zdbk.zju.edu.cn/jwglxt/kbcx/xskbcx_cxXsKb.html?gnmkdm=N253508&su=${userid}`;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": cookies,
    },
    body: new URLSearchParams(data).toString(),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const classInfo = extractClassInfo(data);
      const uniqueClassInfo = removeDuplicates(classInfo); // 去重
      return mergeCourses(uniqueClassInfo); // 合并
    })
    .catch((error) => {
      console.error("There has been a problem with your fetch operation:", error);
      throw error;
    });
}

// 测试代码
const data = {
  xnm: "2024-2025",
  xqm: "1|秋",
  xqmmc: "秋",
  xxqf: "0",
  xsfs: "0",
};

const cookies = document.cookie; // 需要从实际页面中获取
const testid = "3240104320";

getTimetable(testid, cookies, data)
  .then((classInfo) => {
    console.log("Merged Class Info:", classInfo);
  })
  .catch((error) => {
    console.error("Error fetching timetable:", error);
  });