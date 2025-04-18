function toSerializableValue(value: unknown): unknown {
  if (typeof value !== 'object' || value === null) return value
  if (Array.isArray(value)) return value.map(toSerializableValue)
  if (value instanceof Date)
    return { __type: 'Date', __value: value.toISOString() }
  const objCopy = { ...value } as Record<string, unknown>
  Object.entries(objCopy).forEach(
    ([k, v]) => (objCopy[k] = toSerializableValue(v)),
  )
  return objCopy
}

function convertBack(value: unknown): unknown {
  if (typeof value !== 'object' || value === null) return value
  if (Array.isArray(value)) return value.map(convertBack)
  if ('__type' in value && '__value' in value) {
    switch (value.__type) {
      case 'Date':
        return new Date(value.__value as string)
      default:
        throw new TypeError('Unknown __type')
    }
  }
  const objCopy = { ...value } as Record<string, unknown>
  Object.entries(objCopy).forEach(([k, v]) => (objCopy[k] = convertBack(v)))
  return objCopy
}

/**功能类似JSON.stringify，但会将Date特殊处理 */
export function nxStringify(value: unknown) {
  return JSON.stringify(toSerializableValue(value))
}

export function nxParse(json: string) {
  return convertBack(JSON.parse(json))
}
