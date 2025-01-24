import * as lark from '@larksuiteoapi/node-sdk'
import * as dotenv from 'dotenv'

dotenv.config()

export class ShiftRecord {
  ID: string

  /** 没写原因默认继承父记录 */
  reason: string

  from?: Date

  /** 放假结束时间，没写结束时间默认放假1天 */
  end?: Date

  /** 补课时间，没写to默认不补课 */
  to?: Date

  /** 父记录的ID */
  parentRecordId?: string[]

  /** 子记录ID */
  childRecords?: string[]

  /** 飞书提供的唯一标识符 */
  recordId: string

  constructor(data: any) {
    this.ID = data.fields.ID
    this.reason = data.fields['原因']?.[0]?.text
    this.from = this.parseDateWithOffset(data.fields['放假开始时间'])
    this.end = this.parseDateWithOffset(data.fields['放假结束时间'])
    this.to = this.parseDateWithOffset(data.fields['补课时间'])
    this.parentRecordId = data.fields['父记录']?.link_record_ids
    this.recordId = data.record_id
  }

  /**
   * 解析时间并加上 8 小时的时区偏移量
   * @param dateString 时间字符串
   * @returns 调整后的 Date 对象
   */
  private parseDateWithOffset(dateString: string): Date | undefined {
    if (!dateString) return undefined

    const date = new Date(dateString)

    // 加上 8 小时的时区偏移量
    date.setHours(date.getHours() + 8)

    return date
  }
}

export class ShiftService {
  private client: lark.Client
  records: ShiftRecord[] = []
  recordMap: Map<string, ShiftRecord> = new Map() //方便通过唯一标识符找到对应记录

  constructor() {
    // 初始化飞书客户端
    this.client = new lark.Client({
      appId: process.env.APP_ID as string,
      appSecret: process.env.APP_SECRET as string,
      disableTokenCache: false, // 自动管理 token
    })
  }

  /**
   * 从飞书表格加载数据
   * @param pageSize 每页的大小，默认为500，单次最多查询500条记录
   */
  async loadTableRecords(pageSize: number = 500): Promise<void> {
    const records: any[] = []

    // 获取数据
    for await (const item of await this.client.bitable.v1.appTableRecord.searchWithIterator(
      {
        path: {
          app_token: process.env.APP_TOKEN as string,
          table_id: process.env.TABLE_ID as string,
        },
        params: {
          page_size: pageSize,
        },
      },
    )) {
      if (item?.items) {
        records.push(...item.items)
      }
    }

    //解析数据并构建 ShiftRecord 实例
    this.records = records.map((item) => new ShiftRecord(item))

    // 创建 ID 到 ShiftRecord 的映射
    this.records.forEach((record) => {
      this.recordMap.set(record.recordId, record)
    })

    // 还原层级关系
    this.restoreParentChildRelationships()
  }

  /**
   * 还原层级关系
   */
  restoreParentChildRelationships() {
    this.records.forEach((record) => {
      // 如果有父记录ID，找到对应的父记录并将其设置为父记录
      record.parentRecordId?.forEach((parentId) => {
        if (record.parentRecordId) {
          const parentRecord = this.recordMap.get(parentId)
          if (parentRecord) {
            parentRecord['childRecords'] = parentRecord['childRecords'] || []
            parentRecord['childRecords'].push(record.recordId)
          }
        }
      })
    })
  }

  /**
   * 获取没有父记录的项
   * @returns 没有父记录的 ShiftRecord 数组
   */
  getRootRecords(): ShiftRecord[] {
    return this.records.filter((record) => !record.parentRecordId)
  }
}
