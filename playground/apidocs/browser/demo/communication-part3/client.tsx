import React, { Component } from 'react'
import MessageBox from './message-box'
import BottomInput from './bottom-input'

import style from './style.module.less'
import { tengwanggexu } from './use-article'

interface IState {
  messages: string[]
}

export default class Communication3Child extends Component<any, IState>{
  constructor(props: any) {
    super(props)
    this.state = {
      messages: [],
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

  sendToParent = (text: string) => {
    const { opener } = window
    opener.postMessage(text, '*')
  }

  public render() {
    const { messages } = this.state

    return (
      <div className={style.container}>
        <h2>子窗口</h2>
        <MessageBox title='父窗口发送过来的数据' messages={messages} />
        <BottomInput article={tengwanggexu} buttonText='发送信息给父窗口' onSend={this.sendToParent} />
      </div>
    )
  }
}
