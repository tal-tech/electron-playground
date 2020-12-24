import React from 'react'
import Terminal from 'terminal-in-react'
import style from './style.module.less'

const Terminal2 = Terminal as any

interface IStartPageProps {}

const StartPage: React.FunctionComponent<IStartPageProps> = props => {
  const openDoc = () => {
    console.log('opening api panel')
    window.$EB.openWindow('api')
    window.$EB.closeWindow()
  }

  const openEditor = () => {
    console.log('opening editor panel')
    window.$EB.openWindow('editor')
    window.$EB.closeWindow()
  }

  const handleClose = () => {
    console.log('closing window')
    window.$EB.closeWindow()
  }

  const handleMaximise = () => {
    window.$EB.maximizeWindow()
  }

  const handleMinimise = () => {
    window.$EB.minimizeWindow()
  }

  return (
    <div className={style.container}>
      <Terminal2
        msg={`欢迎来到 Electron Playground！
      
      输入"open api" 打开 交互式api文档面板；
      输入"open editor" 打开 演练场。
      
      更多请输入"help"`}
        actionHandlers={{
          handleClose,
          handleMaximise,
          handleMinimise,
        }}
        watchConsoleLogging
        commands={{
          open: {
            method: (args: any, print: any, runCommand: any) => {
              const openType = args._[0]
              if (openType === 'api') openDoc()
              else if (openType === 'editor') openEditor()
              else print(`not valid open type: ${openType}`)
            },
            options: [
              {
                name: 'open',
                description: 'open the target panel',
                defaultValue: 'api',
              },
            ],
          },
        }}
        descriptions={{
          open: 'open the target panel',
        }}
        allowTabs={false}
      />
    </div>
  )
}

export default StartPage
