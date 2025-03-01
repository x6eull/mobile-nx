/**
 *
 * @param str looks like '2025年01月04日(14:00-16:00)'
 */
export const parseZDBKDate = (str: string) => {
  const slice = str
    .split(/年|月|日|\(|\)|:|-/)
    .filter((v: unknown) => v)
    .map(Number)
  return {
    startAt: new Date(
      slice[0],
      slice[1] - 1,
      slice[2],
      slice[3],
      slice[4],
      0,
      0,
    ),
    endAt: new Date(slice[0], slice[1] - 1, slice[2], slice[5], slice[6], 0, 0),
  }
}
