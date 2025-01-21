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


// 获取课程表
function getTimetable(userid, cookies, data) {
  function extractClassInfo(data) {
    const classInfo = [];
    const termIdMap = { 春: "Spring", 夏: "Summer", 秋: "Autumn", 冬: "Winter" };

    const kbList = data.kbList;
    if (!kbList || !Array.isArray(kbList)) {
      console.error("kbList is not an array or is undefined");
      return classInfo;
    }

    for (let i = 0; i < kbList.length; i++) {
      const item = kbList[i];
      const { kcb, dsz, djj, xqj, xxq, sfqd, jszgh, xkkh, skcd, skjc, skdd } = item;

      if (!kcb) {
        console.error("kcb field is missing in one of the items");
        continue;
      }

      const kcbItem = kcb.split("<br>");
      const className = kcbItem[0];
      const classTeacherName = kcbItem[2];
      const classLocation = kcbItem[3];

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

      const weekType = dsz === "0" ? "odd" : dsz === "1" ? "even" : "every";    //教务网中，0代表单周，1代表双周，2代表每周

      const classArrangement = new ClassArrangement(
        weekType,
        DayOfWeek[xqj], // 星期几
        parseInt(djj, 10), // 开始节次
        parseInt(skcd, 10), // 持续节数
        classLocation // 地点
      );

      const course = new Course(
        semester,
        xkkh, // 选课号
        className, // 课程名称
        0, // 学分暂未获取
        classTeacherName, // 教师姓名
        [classArrangement], // 上课时间地点
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
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok.");
    })
    .then((data) => {
      return extractClassInfo(data);
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
    console.log(classInfo);
  })
  .catch((error) => {
    console.error("Error fetching timetable:", error);
  });