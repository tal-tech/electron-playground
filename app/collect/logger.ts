// 保存console的log日志
import log4js from 'log4js'

log4js.configure({
  appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
  categories: { default: { appenders: ['cheese'], level: 'error' } }
})

const logger = log4js.getLogger('cheese')

export default logger