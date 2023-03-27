import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import { Avatar, Button, Card, Col, Form, Row } from 'antd'
import {
  ChatItem,
  MessageBox,
  MessageList,
  MessageType
} from 'react-chat-elements'
import 'react-chat-elements/dist/main.css'
import { Input, Space } from 'antd'
import { AudioOutlined } from '@ant-design/icons'

const { Search } = Input
const inter = Inter({ subsets: ['latin'] })

export default function Home () {
  const [dataSource, setDataSource] = useState<MessageType[]>([
    {
      id: 0,
      focus: false,
      date: new Date(),
      titleColor: '#005DFF',
      forwarded: false,
      replyButton: false,
      removeButton: false,
      status: 'sent',
      notch: true,
      retracted: false,
      position: 'left',
      type: 'text',
      title: (
        <Row align={'middle'}>
          <Col span={8}>
            <Avatar
              src='https://d2cbg94ubxgsnp.cloudfront.net/Pictures/2000xAny/9/9/2/512992_shutterstock_715962319converted_749269.png'
              alt='avatar'
            />
          </Col>
          <Col span={16}>
            <div>HEALTH BOT</div>
          </Col>
        </Row>
      ),
      text: 'Hello, what can i help you?',
    }
  ])

  let userMessage: any = {
    id: 0,
    focus: false,
    date: new Date(),
    titleColor: '#464646',
    forwarded: false,
    replyButton: false,
    removeButton: false,
    status: 'sent',
    notch: true,
    retracted: false,
    position: 'right',
    type: 'text',
    title: '',
    text: 'hello'
  }

  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: '#1890ff'
      }}
    />
  )

  const [form] = Form.useForm()
  const onFinish = (values?: any) => {
    console.log(values)
    userMessage = { ...userMessage, text: values.userMessage }

    setDataSource([...dataSource, userMessage])
    form.resetFields()
  }

  useEffect(() => {
    // console.log(dataSource)
  }, [dataSource])

  return (
    <div
      className='mx-auto flex justify-center p-6 h-screen '
      style={{ backgroundColor: '#E3F3FE' }}
    >
      <div className=' bg-slate-50 rounded-xl shadow-md md:max-w-4xl w-full'>
        <div className='md:flex h-full '>
          <div className='md:flex-shrink-0'>
            <div className='h-48 w-full object-cover md:h-full md:w-48 bg-sky-400' />
          </div>
          <div className='p-8 h-full flex flex-col justify-between w-full'>
            <div className='max-h-[90%] overflow-auto'>
              <MessageList
                className='message-list '
                lockable={true}
                toBottomHeight={'100%'}
                dataSource={dataSource}
                referance={null}
              />
            </div>
            <div className='h-12'>
              <Form
                form={form}
                name='basic'
                // labelCol={{ span: 8 }}
                // wrapperCol={{ span: 16 }}
                // style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={e => {
                  onFinish(e)
                }}
                onFinishFailed={() => {}}
                autoComplete='off'
              >
                <Row align={'middle'}>
                  <Col span={18}>
                    <Form.Item
                      label=''
                      name='userMessage'
                      // rules={[{ required: true, message: '' }]}
                    >
                      <Input
                        placeholder='input message'
                        size='large'
                        suffix={suffix}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item>
                      <Button type='primary' htmlType='submit' className='h-10'>
                        Send
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
