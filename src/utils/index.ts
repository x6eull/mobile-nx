/**utils初始化文件，主要用于加载扩展原型方法 */

import './polyfill'
import './extendHeaders'
import './extendMap'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)
