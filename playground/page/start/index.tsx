import React, { useEffect } from 'react'
import Terminal from 'terminal-in-react'
import style from './style.module.less'

const Terminal2 = Terminal as any

interface IStartPageProps {
}

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

  return <div className={style.container}>
    <Terminal2
      msg={`Welcome to Electron Playground.
       
      Type \`open api\` to open interactive api doc panel, \`open editor\` for writing demo and apps.
      Type \`help\` for all commands`}
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
}

export default StartPage
