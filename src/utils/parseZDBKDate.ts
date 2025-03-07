/**
 *
 * @param str looks like '2025年01月04日(14:00-16:00)'
 */
export const parseZDBKDate = (str: string) => {
  // 使用正则命名捕获处理形如 ''2025年01月04日(14:00-16:00)'' 的字符串
  const { groups } = str.match(
    /(?<year>\d+)年(?<month>\d+)月(?<day>\d+)日\((?<startHour>\d+):(?<startMinute>\d+)-(?<endHour>\d+):(?<endMinute>\d+)\)/,
  ) as { groups: { [key: string]: string } }
  return {
    startAt: new Date(
      Number(groups.year),
      Number(groups.month) - 1,
      Number(groups.day),
      Number(groups.startHour),
      Number(groups.startMinute),
      0,
      0,
    ),
    endAt: new Date(
      Number(groups.year),
      Number(groups.month) - 1,
      Number(groups.day),
      Number(groups.endHour),
      Number(groups.endMinute),
      0,
      0,
    ),
  }
}
