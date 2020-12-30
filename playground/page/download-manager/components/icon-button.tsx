import React, { FunctionComponent } from 'react'
import { Tooltip } from 'antd'

interface IconButtonProps {
  className?: string
  title: string
  onClick?: (...agrs: any) => void
}

const IconButton: FunctionComponent<IconButtonProps> = ({
  className = '',
  title,
  children,
  onClick
}) => {
  return (
    <Tooltip title={title}>
      <a className={`${className}`} onClick={onClick}>
        {children}
      </a>
    </Tooltip>
  )
}

export default IconButton
