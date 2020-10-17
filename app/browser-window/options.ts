/**
 * 这里存放BrowserWindow创建的基本配置。也包括一些特殊页面的扩展配置，特殊页面的扩展配置都是基
 * 于BaseOption。
 */

/**
 * options配置可以参考：
 * https://www.electronjs.org/docs/api/browser-window#new-browserwindowoptions
 *
 * 这里是外部可配置项，开放了除了webPreferences外的所有选项(基本都是外观项)
 */
export interface WindowOptionType
  extends Omit<Electron.BrowserWindowConstructorOptions, 'webPreferences'> {
  // 隐藏Mac下的交通灯🚥和windows/linux下的菜单操作按钮
  _hideWindowButton?: boolean
  isXp?: boolean
}

export const BaseOptions: WindowOptionType = {
  width: 960,
  height: 640,
  minWidth: 960,
  minHeight: 640,
  // https://www.electronjs.org/docs/api/frameless-window#macos-%E4%B8%8A%E7%9A%84%E5%85%B6%E4%BB%96%E6%96%B9%E6%A1%88
  // 此选项专门作用于mac，在mac上可以不需要配置frame就能实现无边框窗口
  titleBarStyle: 'hidden',
  // 关闭windows系统的menu，后续可能使用 `frame:false` 的无边框配置windows，并统一`mac`和`window`的 `titleBar`
  // 缺点：用户按下alt键menu会出现
  autoHideMenuBar: true,
}

export const PlaygroundOption: WindowOptionType = {
  ...BaseOptions,
  width: 1280,
  height: 800,
}
