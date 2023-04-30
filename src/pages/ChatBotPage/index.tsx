import 'regenerator-runtime/runtime'
import { Inter } from 'next/font/google'
import { useEffect, useRef, useState } from 'react'
import { Button, Col, Form, Modal, Row } from 'antd'
import { MessageList, MessageType } from 'react-chat-elements'
import 'react-chat-elements/dist/main.css'
import { Input } from 'antd'
import { postBotMessage } from '@/API/API'
import { UploadImageBox } from '@/components/UploadImageBox'
import { FeedBackBox } from '@/components/FeedBackBox'
import { ThreeDots } from 'react-loader-spinner'
import { MessageModel, MessageModelType } from '@/components/MessageModel'
import { MessageBox } from '@/components/MessageBox'
import moment from 'moment'
import { Typography } from 'antd'
import { BsFillSendFill } from 'react-icons/bs'
import SpeechRecognitionButton from '@/components/SpeechRecognitionButton'
import * as Scroll from 'react-scroll'
import {
  Element,
  Events,
  Link,
  animateScroll as scroll,
  scrollSpy,
  scroller
} from 'react-scroll'

const { Text } = Typography
const { Search } = Input
const inter = Inter({ subsets: ['latin'] })

export default function ChatBotPage () {
  let botMessage: any = MessageModel({
    type: MessageModelType.BotMessage
  })

  let userMessage: any = MessageModel({ type: MessageModelType.UserMessage })

  let botFileMessage: any = MessageModel({
    type: MessageModelType.BotFileMessage
  })

  const [dataSource, setDataSource] = useState<MessageType[]>([])
  const [onUpdateUserInputToScroll, setOnUpdateUserInputToScroll] = useState<
    any[]
  >([])
  const buttonRef = useRef<any>(null)

  const [form] = Form.useForm()
  let messageId: number = 0
  const onFinish = (values?: any) => {
    setOnUpdateUserInputToScroll(e => [...e, 0])
    messageId++
    userMessage = {
      ...userMessage,
      id: messageId,
      date: moment().format(),
      text: <Text className='text-lg'>{values.userMessage}</Text>
    }
    setDataSource(e => [...e, userMessage])
    form.resetFields()

    if (values.userMessage == 'image') {
      setDataSource(e => [...e, botFileMessage])
    } else {
      botMessage = {
        ...botMessage,
        status: 'waiting',
        text: (
          <ThreeDots
            height='30'
            width='30'
            radius='5'
            color='#808080'
            ariaLabel='three-dots-loading'
            wrapperStyle={{}}
            visible={true}
          />
        ) as any
      }
      setDataSource(e => [...e, botMessage])
      postBotMessage(values.userMessage)
        .then(res => {
          const isSkin = res.data.botMessage?.message || ''
          if (isSkin.includes('skin issue')) {
            setDataSource(e => [
              ...e.map(e => {
                if (e.status == 'waiting') {
                  e.status = 'sent'
                  e.text = (
                    <>
                      <MessageBox botMessage={res.data.botMessage} />
                    </>
                  ) as any
                }
                return e
              }),
              botFileMessage
            ])
          } else {
            setDataSource(e => [
              ...e.map(e => {
                if (e.status == 'waiting') {
                  e.status = 'sent'
                  e.date = moment().format() as any
                  e.text = (
                    <>
                      <MessageBox botMessage={res.data.botMessage} />
                    </>
                  ) as any
                }
                return e
              })
            ])
          }
        })
        .catch(err => {
          console.log(err)
          setDataSource(e => [
            ...e.map(e => {
              if (e.status == 'waiting') {
                e.status = 'sent'
                e.text = (
                  <p className='text-lg text-red-500'>
                    Network Error, Please try again
                  </p>
                ) as any
              }
              return e
            })
          ])
        })
    }
  }

  useEffect(() => {
    setDataSource([botMessage])
    return () => {}
  }, [])

  useEffect(() => {
    if (buttonRef && buttonRef.current) {
      buttonRef.current.click()
    }
  }, [onUpdateUserInputToScroll])

  return (
    <div
      className='mx-auto flex justify-center p-6 h-screen '
      style={{ backgroundColor: '#E3F3FE' }}
    >
      {/* <Dictaphone /> */}
      <div className=' bg-slate-50 rounded-xl shadow-md md:max-w-4xl w-full'>
        <div className='md:flex h-full '>
          <div className='md:flex-shrink-0'>
            <div className='h-48 w-full object-cover md:h-full md:w-48 bg-sky-400 rounded-l-lg' />
          </div>
          <div className='h-full flex flex-col justify-between w-full'>
            <Link
              activeClass='active'
              to='EmptyBottomElementScroll'
              spy={true}
              smooth={true}
              duration={250}
              containerId='containerElement'
              style={{ display: 'none', margin: '20px' }}
            >
              <Button ref={buttonRef}></Button>
            </Link>
            <Element
              name='empty'
              id='containerElement'
              className='max-h-[90%] overflow-scroll p-4'
            >
              <MessageList
                className='message-list '
                lockable={true}
                toBottomHeight={'100%'}
                dataSource={dataSource}
                referance={null}
              />
              <Element
                name='EmptyBottomElementScroll'
                className='md:mb-10'
              ></Element>
            </Element>
            <div className='h-12 bg-slate-100 rounded-full p-1 w-11/12 mx-auto shadow-md mb-2'>
              <Form
                className={'px-8 h-full'}
                form={form}
                name='basic'
                initialValues={{ remember: true }}
                onFinish={e => {
                  onFinish(e)
                }}
                onFinishFailed={() => {}}
                autoComplete='off'
              >
                <div className='flex flex-row '>
                  <Form.Item
                    label=''
                    name='userMessage'
                    className='w-full'
                    // rules={[{ required: true, message: '' }]}
                  >
                    <Input
                      placeholder='input message'
                      size='large'
                      suffix={
                        <SpeechRecognitionButton
                          onUpdateText={e => {
                            if (e) {
                              form.setFieldsValue({ userMessage: e })
                            }
                          }}
                        />
                      }
                      // className={'rounded-lg'}
                    />
                  </Form.Item>
                  <Form.Item className='ml-2'>
                    <Button type='primary' htmlType='submit' className='h-10'>
                      <div className='flex justify-items-center'>
                        Send
                        <BsFillSendFill
                          size={20}
                          style={{ marginLeft: '0.2em' }}
                        />
                      </div>
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
