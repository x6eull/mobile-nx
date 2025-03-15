import express from 'express'
import { ShiftService } from './shift'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

const shiftService = new ShiftService()

// 定义缓存变量和缓存更新时间
const CACHE_EXPIRY_TIME = 300 * 1000 // 1分钟（单位：毫秒）

// 启动时加载数据并缓存
await shiftService.loadTableRecords()
let cache = shiftService.records

// 设置定时任务每分钟更新缓存
setInterval(async () => {
  try {
    await shiftService.loadTableRecords()
    cache = shiftService.records
    console.log('Cache updated at:', Date.now())
  } catch (error) {
    console.error('Error updating cache:', (error as Error).message)
  }
}, CACHE_EXPIRY_TIME)

// 解析 JSON 请求体
app.use(express.json())

// 加载数据的 API
app.get('/load-records', async (req, res) => {
  try {
    res.status(200).json({
      message: 'Records loaded successfully',
      records: cache, // 返回加载的记录
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error loading records',
      error: (error as Error).message,
    })
  }
})

// 启动服务
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
