import { ipcMain, IpcMainInvokeEvent } from 'electron'
import { IPCEventName } from './interface'

/**
 * 添加 ipc 调用的处理事件
 * @param eventName - ipc 事件名
 * @param listener - 回调事件
 */
export const ipcMainHandle = <T>(
  eventName: IPCEventName,
  listener: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<T> | void | T,
): void => {
  ipcMain.handle(eventName, async (event, ...args: any[]) => {
    return listener(event, ...args)
  })
}
