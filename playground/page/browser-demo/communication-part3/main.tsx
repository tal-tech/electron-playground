import React, { Component } from 'react'
import { Button } from 'antd'

import style from './style.module.less'
import BottomInput from './bottom-input'
import MessageBox from './message-box'
import { yueyanglouji } from './use-article'

interface IState {
  messages: string[]
  childWindow: Window | null
}

export default class Communication3Parent extends Component<any, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      messages: [],
      childWindow: null,
    }
  }

  componentDidMount() {
    window.addEventListener('message', this.onMessage)
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onMessage)
  }

  onMessage = (e: MessageEvent) => {
    const { messages } = this.state
    const newMessages = [...messages, e.data]
    this.setState({ messages: newMessages })
  }

  openPage = () => {
    const { childWindow } = this.state
    childWindow?.close()

    const newChildWindow = window.open(
      `${window.location.pathname}#demo/communication-part3/client`,
    )
    this.setState({ childWindow: newChildWindow })
  }

  sendToChild = (text: string) => {
    const { childWindow } = this.state
    childWindow?.postMessage(text, '*')
  }

  public render() {
    const { messages, childWindow } = this.state

    return (
      <div className={style.container}>
        <h2>父窗口</h2>
        {!childWindow ? (
          <Button type='primary' onClick={this.openPage}>
            打开子窗口
          </Button>
        ) : (
          <>
            <MessageBox title='子窗口发送过来的数据' messages={messages} />
            <BottomInput article={yueyanglouji} buttonText='发送信息给子窗口' onSend={this.sendToChild} />
          </>
        )}
      </div>
    )
  }
}
