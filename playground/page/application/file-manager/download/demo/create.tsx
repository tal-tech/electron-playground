import React, { useState, useEffect, useMemo } from 'react'
import { Form, Input, Modal } from 'antd'
import { EllipsisOutlined } from '@ant-design/icons'

import {
  retryDownloadFile,
  getDownloadPath,
  newDownloadFile,
  openFileDialog,
} from '../../ipc-renderer'
import { INewDownloadFile } from '../../../../../../app/file-manager/interface'

interface CreateModalProps {
  show: boolean
  onClose?: () => void
}

const CreateModal = ({ show, onClose }: CreateModalProps) => {
  const [showCreate, setShowCreate] = useState<boolean>(show)
  const [formData, setFormData] = useState<INewDownloadFile>({
    url: '',
    path: '',
  })

  const disabled = useMemo(() => !(formData.url && formData.path), [formData.url, formData.path])

  // 获取光标，选中内容
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select()
  }

  // 设置表单值
  const handleFormChange = (field: string, data?: string) => {
    setFormData({
      ...formData,
      [field]: data,
    })
  }

  // 下载开始
  const handleOk = async () => {
    const item = await newDownloadFile(formData)
    if (!item) return

    Modal.confirm({
      content: (
        <p>
          已存在<strong>{item.fileName}</strong>文件，确认覆盖？
        </p>
      ),
      okText: '确认',
      cancelText: '取消',
      okButtonProps: {
        type: 'default',
      },
      cancelButtonProps: {
        type: 'primary',
      },
      onOk: () => {
        retryDownloadFile(item)
      },
    })
  }

  // 关闭新建对话框
  const handleCancel = () => {
    setShowCreate(false)
    onClose?.()
  }

  // 选择保存位置
  const handleChoosePath = async () => {
    const newPath = await openFileDialog(formData.path || '')

    setFormData({
      ...formData,
      path: newPath,
    })
    handleFormChange('path', newPath)
  }

  useEffect(() => {
    setShowCreate(show)

    return () => {
      setFormData({
        url: '',
        fileName: '',
        path: getDownloadPath(),
      })
    }
  }, [show])

  return (
    <Modal
      title='新建下载'
      centered
      visible={showCreate}
      okText='下载'
      cancelText='取消'
      okButtonProps={{ disabled }}
      onOk={handleOk}
      onCancel={handleCancel}>
      <Form labelCol={{ span: 3 }}>
        <Form.Item label='地址：'>
          <Input
            value={formData?.url}
            onChange={e => handleFormChange('url', e.target.value)}
            onFocus={handleFocus}
          />
        </Form.Item>
        <Form.Item label='文件名：'>
          <Input
            value={formData?.fileName}
            onChange={e => handleFormChange('filename', e.target.value)}
            onFocus={handleFocus}
          />
        </Form.Item>
        <Form.Item label='位置：'>
          <Input
            readOnly
            value={formData?.path}
            addonAfter={<EllipsisOutlined onClick={handleChoosePath} />}
            onClick={handleChoosePath}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateModal
