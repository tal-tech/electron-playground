import { Menu, MenuItemConstructorOptions, ipcMain } from 'electron'
import { appUpdater } from 'app/updater'

export function setupMenu() {
  type MenuItemsType = MenuItemConstructorOptions[]
  const menuOption: MenuItemsType = [
    {
      label: '操作',
      submenu: [
        { role: 'about' },
        {
          label: 'check update',
          click() {
            appUpdater.manualCheck()
          },
        },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'quit' },
      ],
    },
    {role: 'editMenu'},
    {role: 'fileMenu'},
    {role: 'viewMenu'},
    {role: 'windowMenu'},
    // TODO: 待添加，访问官网文档，访问github，上报issue等
    // {
    //   label: 'Help',
    //   submenu: [
    //   ]
    // },
  ]
  const handleOption = Menu.buildFromTemplate(menuOption) // 构造MenuItem的选项数组。
  // 设置菜单
  // Menu.setApplicationMenu(null)
  Menu.setApplicationMenu(handleOption)

}

ipcMain.on('SetupMenu', setupMenu)

