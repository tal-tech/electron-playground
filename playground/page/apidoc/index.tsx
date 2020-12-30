import React, { useCallback, useEffect, useMemo, useState } from 'react'
import fs from 'fs'
import path from 'path'
import { Layout, Menu } from 'antd'
import Markdown from 'components/markdown'

import style from './style.module.less'

interface IApidocProps {}

interface MenusInfo {
  filePath: string
  title: string
  children?: MenusInfo[]
}

const apidoc_path = path.resolve(__dirname,'..','..','playground', 'apidocs')
let menus: MenusInfo[] = []

function findMarkdowns(dirPath: string, parentChildrenFolder: MenusInfo[]) {
  if (!fs.statSync(dirPath).isDirectory()) return
  const files = fs.readdirSync(dirPath)
  files.forEach(f => {
    const fullPath = path.join(dirPath, f)
    // img和components不展示到目录中
    if(['img', 'components'].includes(f)) return
    if (fs.statSync(fullPath).isFile() && path.extname(fullPath) === '.md') {
      parentChildrenFolder.push({filePath: fullPath, title: f.replace(/.md$/, '')})
      return
    }
    if (fs.statSync(fullPath).isDirectory()) {
      const folder = {title: f, children: [], filePath: fullPath}
      parentChildrenFolder.push(folder)
      findMarkdowns(fullPath, folder.children)
    }
  })
}
if(process.env.NODE_ENV!=='production'){
  findMarkdowns(apidoc_path, menus)
} else{
  menus = process.env.API_MENUS as any
}

console.log(process.env)

const Apidoc: React.FunctionComponent<IApidocProps> = props => {
  const [content, setContent] = useState('')

  const handleMenuClick = (filePath: string) => {
    import(`../../apidocs${  filePath.replace(apidoc_path,'')}`).then(res=> {
      setContent('')
      setContent(res.default)
    })
  }

  // 用于menu的子菜单展开
  const defaultOpenKeys = useMemo(() => {
    return menus.filter(m=>m.children?.length).map(i=>i.filePath)
  }, [])

  const generateMenus = (menu: MenusInfo) => {
    const {filePath, title, children} = menu
    if(children?.length){
      return <Menu.SubMenu title={title} key={filePath}>
        {children.map((item,index) => generateMenus(item) )}
      </Menu.SubMenu> 
    }
    return <Menu.Item onClick={() => handleMenuClick(filePath as string)} key={filePath}>{title}</Menu.Item>
  }
  
  console.log(content)

  return (
    <Layout className={style.container}>
      <Layout.Sider width={256}>
        <Menu mode="inline" className={style.menu} defaultOpenKeys={defaultOpenKeys}>
          {menus.map(i=>generateMenus(i))}
        </Menu>
      </Layout.Sider>
      <Layout className={style.main}>
        <Layout.Content className={style.content}>
          { content && <Markdown content={content}/> }
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

export default Apidoc
