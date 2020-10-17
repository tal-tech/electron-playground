// 自动更新
import { app } from 'electron'
import logger from 'electron-log'
import 'colors'
import { messageBox } from 'app/dialog'
import { boundClass } from 'autobind-decorator'
import { autoUpdater, UpdateInfo } from 'electron-updater'
// electron-updater的依赖 用于类型声明
import { ProgressInfo } from 'builder-util-runtime/out/ProgressCallbackTransform'

/**
 * 更新过程可以视作一个状态机:
 *
 *      Uninitialized
 *           ↓
 *          Idle
 *          ↓  ↑
 *   Checking for Updates  →  Available for Download
 *         ↓
 *     Downloading  →   Ready
 *         ↓               ↑
 *     Downloaded   →  Updating
 *
 * Uninitialized          :未初始化
 * Idle                   :空闲
 * Checking for Updates   :检查中
 * Available for Download :有可下载更新
 * Downloading            :下载中
 * Downloaded             :下载完成
 * Updating               :更新中
 * Ready                  :已准备好重启更新
 *
 * 目前的APP中其实Downloaded和Updating状态是不存在的，而是直接Downloading -> Ready
 * 因为目前的应用逻辑中没有更新前的准备工作（保存状态等）
 * 但是之后可能会添加类似的更新前操作，因此这两个状态也预置出来。
 *
 * （更新状态变化流程参考了vscode）
 */
export const enum UpdateStatus {
  Uninitialized,
  Idle,
  Checking,
  Available,
  Downloading,
  Downloaded,
  Updating,
  Ready,
}

// 本地的更新地址(可在本地对应的release版本目录下启一个服务器)，比如vscode的live server插件
// 一键启动，挺好用的
const LOCAL_UPDATE_PATH = 'http://127.0.0.1:8080/0.1.1-test/'

/**
 * [autoUpdater]文档: https://www.electron.build/auto-update
 */
@boundClass
export class AppUpdater {
  constructor() {
    logger.transports.file.level = 'info'
    autoUpdater.logger = logger

    /**
     * @abstract autoUpdater相关配置项
     * [autoDownload        ]. ❌ 自动下载（因为用户可以手动触发检查更新并选择是否下载）
     * [autoInstallOnAppQuit]. ✅ 退出app时自动安装更新
     * [allowPrerelease     ]. ❌ 预发布版本（暂无预发布版本规划）
     * [allowDowngrade      ]. ❌ 允许降级，从预发布版本降级到正式版本（暂不需要）
     */
    autoUpdater.autoDownload = false
    autoUpdater.autoInstallOnAppQuit = true
    autoUpdater.allowPrerelease = false
    autoUpdater.allowDowngrade = false

    this.log('currentVersion', autoUpdater.currentVersion)

    autoUpdater.on('error', this.onError)
    autoUpdater.on('checking-for-update', this.onChecking)
    autoUpdater.on('update-available', this.onUpdateAvailable)
    autoUpdater.on('update-not-available', this.onUpdateNotAvailable)
    autoUpdater.on('download-progress', this.onDownloadProgress)
    autoUpdater.on('update-downloaded', this.onUpdateDownloaded)

    if (process.env.NODE_ENV === 'development') {
      autoUpdater.setFeedURL(LOCAL_UPDATE_PATH)
    }
    this.setStatus(UpdateStatus.Idle)
  }

  /**
   * @abstract
   * 当前更新是否为静默模式。
   *
   * @description
   * 检查更新和下载更新等过程有app启动后自检查，还有用户手动触发检查这两种。
   * 这两者可能会重叠（比如自动更新检测到后下载过程中触发了用户手动检查更新）,此时不应该再重复
   * 触发更新，但交互形式不同。
   */
  private silent = false

  private _status: UpdateStatus = UpdateStatus.Uninitialized

  private get status() {
    return this._status
  }

  private setStatus(status: UpdateStatus) {
    this._status = status
    this.log('status updated.')
  }

  private updateInfo: UpdateInfo | null = null

  private get updateInfoMessage() {
    if (!this.updateInfo) {
      return ''
    }
    const { version = '', releaseName = '', releaseNotes = '' } = this.updateInfo
    return `${version} ${releaseName}
${releaseNotes}`
  }

  private log(...args: unknown[]) {
    console.log(`[AppUpdater][silent: ${this.silent}][status: ${this.status}]--`.blue, ...args)
  }

  private async onError(error: Error) {
    this.log('更新异常:', error)
    /** @todo 这里有个问题，一次更新异常会触发两次onError事件，报同一个错 */
    if (!this.silent) {
      await messageBox.warning({
        message: '更新异常',
        detail: error?.message + error?.stack,
        buttons: ['确定'],
      })
    }
    this.setStatus(UpdateStatus.Idle)
  }

  private onChecking() {
    this.setStatus(UpdateStatus.Checking)
  }

  private async onUpdateAvailable(info: UpdateInfo) {
    this.log('有可用更新:', info)
    this.setStatus(UpdateStatus.Available)
    this.updateInfo = info
    if (!this.silent) {
      const { response } = await messageBox.info({
        message: '有可用更新',
        detail: this.updateInfoMessage,
        buttons: ['取消', '下载更新'],
      })
      if (response === 1) {
        autoUpdater.downloadUpdate()
      }
    } else {
      autoUpdater.downloadUpdate()
    }
  }

  private async onUpdateNotAvailable(info: UpdateInfo) {
    this.log('无可用更新', info)
    if (!this.silent) {
      await messageBox.info({
        message: '无可用更新',
      })
    }
    this.setStatus(UpdateStatus.Idle)
  }

  private async onDownloadProgress(progressInfo: ProgressInfo) {
    this.log('下载更新中', progressInfo)
    this.setStatus(UpdateStatus.Downloading)
  }

  private async onUpdateDownloaded(info: UpdateInfo) {
    this.log('下载完成', info)
    if (!this.silent) {
      const { response } = await messageBox.info({
        message: '下载完成, 立即更新？',
        detail: this.updateInfoMessage,
        buttons: ['取消', '确定'],
      })
      if (response === 0) {
        this.setStatus(UpdateStatus.Ready)
        return
      }
      if (response === 1) {
        autoUpdater.quitAndInstall()
        // 如果updater退出不成功，手动调用退出
        setTimeout(() => {
          app.quit()
        }, 500)
        return
      }
    }
    this.setStatus(UpdateStatus.Ready)
  }

  /**
   * 静默检查
   * 只有在当前状态为idle时才进行检查，其他状态不管是在静默检查过程还是手动检查过程中其实都不需要再做检查。
   *
   * TODO：可能存在用户停留很久很久很久不更新等到下个版本都出来了，那么就没有检查到后面的版本了，可以尝试给检查到更新的版本设置过期时间，过期后
   * 重新检查
   */
  public silentCheck() {
    if (this.status === UpdateStatus.Idle) {
      this.silent = true
      autoUpdater.checkForUpdates()
    }
  }

  /**
   * 用户手动检查
   * 手动检查时可能由于此时处于静默更新过程中，所以会存在多种状态，不能直接去调起自动检查更新就完事，需要针对不同状态给用户不同提示
   */
  public async manualCheck() {
    this.silent = false
    switch (this.status) {
      case UpdateStatus.Idle:
        this.silent = false
        autoUpdater.checkForUpdates()
        break
      case UpdateStatus.Checking:
        this.silent = false
        break
      case UpdateStatus.Available:
        this.silent = false
        this.onUpdateAvailable(this.updateInfo as UpdateInfo)
        break
      case UpdateStatus.Downloading:
        messageBox.info({
          message: '有可用更新，下载中...',
          detail: `${this.updateInfoMessage}
          ad
          asd
          `,
        })
        break
      // case UpdateStatus.Updating:
      case UpdateStatus.Downloaded:
      case UpdateStatus.Ready:
        const { response } = await messageBox.info({
          message: '有可用更新，已下载完成，是否立即更新?',
          detail: this.updateInfoMessage,
          buttons: ['取消', '确定'],
        })
        if (response === 1) {
          autoUpdater.quitAndInstall()
        }
        break
      default:
        break
    }
    return this.status
  }
}

export const appUpdater = new AppUpdater()

// 五个小时检测一次更新
const INTERVAL = 1000 * 60 * 60 * 5

/** 开启静默检查更新任务 */
export function startUpdaterSchedule() {
  setInterval(() => {
    appUpdater.silentCheck()
  }, INTERVAL)
}
