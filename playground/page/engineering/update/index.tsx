import * as React from 'react'
import Markdown from 'components/markdown'
import style from './style.module.less'
import md from './update.md'

interface IUpdatePageProps {
}

const UpdatePage: React.FunctionComponent<IUpdatePageProps> = props => {
  return <div className={style.container}>
    <Markdown content={md}/>
  </div>
}

export default UpdatePage
