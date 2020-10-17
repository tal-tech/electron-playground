import * as React from 'react'
import Markdown from 'components/markdown'
import style from './style.module.less'
import md from './packaging.md'

interface IPackPageProps {
}

const PackPage: React.FunctionComponent<IPackPageProps> = props => {
  return <div className={style.container}>
    <Markdown content={md}/>
  </div>
}

export default PackPage
