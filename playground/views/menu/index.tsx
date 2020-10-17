import React, { useState, useEffect } from 'react'
import { Menu } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'
import menuArr from '../menuArr'
import style from './style.module.less'

export interface ChildrenObj {
  item: string
  key: string
  path?: string
}

export interface FatherObj {
  item: string
  key: string
  icon: JSX.Element
  children: ChildrenObj[]
}

const { SubMenu } = Menu

export default function MenuComponent() {
  const history = useHistory()
  const location = useLocation()
  const [keys, setKeys] = useState<[string[], string[]]>([[], []])

  const handleClick = (path: string | undefined) => {
    if (path) {
      history.push(path)
    }
  }

  const [openKeys, selectedKeys] = keys

  useEffect(() => {
    menuArr.find(submenu =>
      submenu.children.find(item => {
        if (item.path === location.pathname) {
          setKeys([[...openKeys, submenu.key], [item.key]])
          return true
        }
        return false
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <Menu
      className={style.menu}
      theme='light'
      key={`${openKeys.join(',')}-${selectedKeys.join(',')}`}
      defaultOpenKeys={openKeys}
      defaultSelectedKeys={selectedKeys}
      mode='inline'>
      {menuArr.map(item => {
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                {item.icon}
                <span>{item.item}</span>
              </span>
            }>
            {item.children.map(menu => (
              <Menu.Item onClick={handleClick.bind(null, menu.path)} key={menu.key}>
                {menu.item}
              </Menu.Item>
            ))}
          </SubMenu>
        )
      })}
    </Menu>
  )
}
