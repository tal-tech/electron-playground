import React, { useState } from 'react'
import { Input, Button } from 'antd'
import style from './style.module.less'
import useArticle from './use-article'

interface IBottomInputProps {
  article?: string[]
  buttonText?: string
  onSend(text: string): void
}

const BottomInput: React.FunctionComponent<IBottomInputProps> = props => {
  const { buttonText = '发送', onSend, article = [] } = props
  const [value, setValue] = useState('')
  const {text, nextLine} = useArticle(article)
  
  const onSubmit = () => {
    onSend(value || text)
    setValue('')
    nextLine()
  }

  return (
    <footer className={style.footer}>
      <Input placeholder={text} onPressEnter={onSubmit} onChange={e => setValue(e.target.value)} value={value} />
      <Button type='primary' onClick={onSubmit}>{buttonText}</Button>
    </footer>
  )
}

export default BottomInput
