import * as React from 'react'
import Markdown from 'components/markdown'
import style from './style.module.less'
import md from './development.md'

interface IDevelopmentPageProps {}


const DevelopmentPage: React.FunctionComponent<IDevelopmentPageProps> = props => {
  return (
    <div className={style.container}>
      <Markdown content={md} />
    </div>
  )
}

export default DevelopmentPage
