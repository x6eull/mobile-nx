/**
 *
 * @param str looks like '2025年01月04日(14:00-16:00)'
 */
export const parseZDBKDate = (str: string) => {
  // 使用正则命名捕获处理形如 ''2025年01月04日(14:00-16:00)'' 的字符串
  const { day, year, month, startHour, startMinute, endHour, endMinute } =
    str.match(
      /(?<year>\d+)年(?<month>\d+)月(?<day>\d+)日\((?<startHour>\d+):(?<startMinute>\d+)-(?<endHour>\d+):(?<endMinute>\d+)\)/,
    )!.groups!
  return {
    startAt: new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(startHour),
      Number(startMinute),
      0,
      0,
    ),
    endAt: new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(endHour),
      Number(endMinute),
      0,
      0,
    ),
  }
}
