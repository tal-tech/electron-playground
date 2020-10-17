// store的字段数据以及store的默认值

const schema = {
  foo: {
    type: 'string',
    default: 'This is a test default string'
  }
} as const


export default schema