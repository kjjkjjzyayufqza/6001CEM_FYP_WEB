import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Row,
  Spin,
  Upload,
  UploadFile
} from 'antd'
import {
  ChatItem,
  MessageBox,
  MessageList,
  MessageType
} from 'react-chat-elements'
import 'react-chat-elements/dist/main.css'
import { Input, Space } from 'antd'
import { AudioOutlined, PlusOutlined } from '@ant-design/icons'
import { postBotMessage, postImage } from '@/API/API'
import { UploadImageBox } from '@/components/UploadImageBox'
import { MessageModel, MessageModelType } from '@/MODEL/MessageModel'

const { Search } = Input
const inter = Inter({ subsets: ['latin'] })

export default function Home () {

  let botMessage: any = MessageModel({
    type: MessageModelType.BotMessage
  })

  let userMessage: any = MessageModel({ type: MessageModelType.UserMessage })

  let botFileMessage: any = MessageModel({
    type: MessageModelType.BotFileMessage,
    Children: (
      <Row>
        <Col span={24}>Okay, can you upload the relevant photos?</Col>
        <Col span={24}>
          <UploadImageBox
            onUploadDone={(message: string) => {
              botMessage = {
                ...botMessage,
                status: 'sent',
                text: message
              }
              setDataSource(e => [...e, botMessage])
            }}
          />
        </Col>
      </Row>
    )
  })

  const [dataSource, setDataSource] = useState<MessageType[]>([botFileMessage])

  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: '#1890ff'
      }}
    />
  )

  const [form] = Form.useForm()
  let messageId: number = 0
  const onFinish = (values?: any) => {
    messageId++
    userMessage = { ...userMessage, id: messageId, text: values.userMessage }
    setDataSource(e => [...e, userMessage])
    form.resetFields()

    if (values.userMessage == 'image') {
      setDataSource(e => [...e, botFileMessage])
    } else {
      botMessage = {
        ...botMessage,
        status: 'waiting',
        text: (<Spin spinning />) as any
      }
      setDataSource(e => [...e, botMessage])
      postBotMessage(values.userMessage)
        .then(res => {
          setDataSource(e => [
            ...e.map(e => {
              if (e.status == 'waiting') {
                e.status = 'sent'
                e.text = res.data.botMessage
              }
              return e
            })
          ])
        })
        .catch(err => {
          console.log(err)
        })
    }
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
