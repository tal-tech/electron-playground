function initTopDrag() {
  const topDiv = document.createElement('div') // 创建节点
  topDiv.style.position = 'fixed' // 一直在顶部
  topDiv.style.top = '0'
  topDiv.style.left = '0'
  topDiv.style.height = '20px' // 顶部20px才可拖动
  topDiv.style.width = '100%' // 宽度100%
  topDiv.style.zIndex = '9999' // 悬浮于最外层
  topDiv.style.pointerEvents = 'none' // 用于点击穿透
  // @ts-ignore
  topDiv.style['-webkit-user-select'] = 'none' // 禁止选择文字
  // @ts-ignore
  topDiv.style['-webkit-app-region'] = 'drag' // 拖动
  document.body.appendChild(topDiv) // 添加节点
}

window.addEventListener('DOMContentLoaded', function onDOMContentLoaded() {
  initTopDrag()
})
