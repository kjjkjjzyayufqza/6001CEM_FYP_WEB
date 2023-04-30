import { Button, Space, Statistic, Typography } from 'antd'
import ChatBotPage from './ChatBotPage'
import { MessageBox } from 'react-chat-elements'
import 'react-chat-elements/dist/main.css'
import { ExampleMessageBox } from '@/components/ExampleMessageBox'
import {
  ChromeOutlined,
  MinusCircleOutlined,
  SyncOutlined
} from '@ant-design/icons'
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { getServerStatus } from '@/API/API'
import * as Scroll from 'react-scroll'
import {
  Element,
  Events,
  Link,
  animateScroll as scroll,
  scrollSpy,
  scroller
} from 'react-scroll'
const { Title, Paragraph, Text } = Typography
export default function Home () {
  const [serverPrefix, setServerPrefix] = useState<{
    Status: any
    Icon: ReactNode | null
    Color: string
  }>({ Status: 'Checking', Icon: <SyncOutlined spin />, Color: '#AAAAAA' })

  useEffect(() => {
    getServerStatus()
      .then(res => {
        setServerPrefix({
          Status: 'Online',
          Icon: <ChromeOutlined twoToneColor={'#3f8600'} spin />,
          Color: '#3f8600'
        })
      })
      .catch(err => {
        setServerPrefix({
          Status: 'Offline',
          Icon: <MinusCircleOutlined twoToneColor={'#FF5100'} />,
          Color: '#FF5100'
        })
      })
  }, [])

  const scrollTo = (value = 100) => {
    scroll.scrollMore(value)
  }

  return (
    <div className=''>
      <div
        className='mx-auto flex flex-wrap justify-between p-5 flex-col md:flex-row items-center'
        style={{ backgroundColor: '#2C3134' }}
      >
        <div className='flex'>
          <img
            src='https://vitejs.dev/logo-with-shadow.png'
            className='h-8 mr-3'
          />
          <Text className='self-center text-2xl font-semibold whitespace-nowrap text-white'>
            Health Chat
          </Text>
        </div>
        <div className='flex'>
          <Space>
            <Button
              type={'ghost'}
              onClick={() => {
                scrollTo(100)
              }}
            >
              <Text className='text-lg text-white' strong>
                {'Introduction'.toUpperCase()}
              </Text>
            </Button>
            <Button
              type={'ghost'}
              onClick={() => {
                scrollTo(1220)
              }}
            >
              <Text className='text-lg text-white' strong>
                {'Chat'.toUpperCase()}
              </Text>
            </Button>
            <Button
              type={'ghost'}
              onClick={() => {
                scrollTo(1500)
              }}
            >
              <Text className='text-lg text-white' strong>
                {'Other'.toUpperCase()}
              </Text>
            </Button>
          </Space>
        </div>
        <div className='flex md:order-2'>
          <Button
            type={'ghost'}
            style={{ backgroundColor: '#0078FF', height: '3em' }}
            onClick={() => {
              console.log('hi')
            }}
          >
            <Text className='text-xl text-white'>Download APP</Text>
          </Button>
        </div>
      </div>
      <div>
        <div
          className='relative flex flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12'
          style={{ height: '60vh' }}
        >
          <img
            src='beams.jpg'
            alt=''
            className='absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2'
          />
          <div className='max-w-md mx-auto bg-white rounded-xl  overflow-hidden md:max-w-5xl'>
            <div className='md:flex'>
              <div className='relative md:shrink-0'>
                <img
                  src='mainBot.png'
                  className='h-48 w-full object-contain md:h-full md:w-96'
                />
              </div>
              <div className='relative md:w-20'></div>
              <div className='relative px-6 pb-8 pt-10 '>
                <div>
                  <Text strong className='text-5xl'>
                    Health Chat
                  </Text>
                </div>
                <div className='pt-5'>
                  <Text className='text-3xl'>
                    A intelligent medical chatbots
                  </Text>
                </div>
                <div className='mt-3'>
                  <Button
                    style={{ backgroundColor: '#FF6A00', height: '4em' }}
                    onClick={() => {
                      console.log('hi')
                    }}
                    type={'ghost'}
                  >
                    <Text className='text-2xl text-white'>Get Started</Text>
                  </Button>
                </div>
                <div>
                  <Paragraph className='mt-3'>
                    Provide suggestions and{' '}
                    <Text code> recommend doctors (Mobile app required)</Text>
                  </Paragraph>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='relative md:flex justify-center  bg-gray-100 py-6 sm:py-12'>
        <div className='max-w-md mx-auto md:max-w-6xl'>
          <div className='md:flex'>
            <div className='md:mx-auto bg-gray-50  rounded-lg px-6 py-8 ring-1 ring-slate-900/5 '>
              <div>
                <Paragraph className='text-xl'>
                  The chatbot automatically determines the{' '}
                  <Text strong className='text-xl'>
                    diseases
                  </Text>{' '}
                  the user has based on the user's input and makes corresponding{' '}
                  <Text strong className='text-xl'>
                    suggestions
                  </Text>
                  . Also, if the user asks about a{' '}
                  <Text strong className='text-xl'>
                    skin problem
                  </Text>
                  , the chatbot asks for a photo for further{' '}
                  <Text strong className='text-xl'>
                    disease prediction
                  </Text>
                  . The following are currently supported
                </Paragraph>
              </div>
              <div className='ring-1 ring-slate-900/5'>
                <Paragraph>
                  <ul>
                    <li>
                      <Text>Principles</Text>
                    </li>
                    <li>
                      <Text>Principles</Text>
                    </li>
                    <li>
                      <Text>Principles</Text>
                    </li>
                  </ul>
                </Paragraph>
              </div>
              <div>
                <Paragraph className='text-xl'>
                  For skin disease prediction, there are the following
                </Paragraph>
                <Paragraph className='ring-1 ring-slate-900/5'>
                  <ul>
                    <li>
                      <Text>Principles</Text>
                    </li>
                    <li>
                      <Text>Principles</Text>
                    </li>
                    <li>
                      <Text>Principles</Text>
                    </li>
                  </ul>
                </Paragraph>
              </div>
            </div>
            <div className='relative md:w-20'></div>
            <div className='md:mx-auto bg-gray-50 dark:bg-slate-800 rounded-lg p-4 ring-1 ring-slate-900/5 shadow-xl'>
              <ExampleMessageBox />
            </div>
          </div>
        </div>
      </div>
      <ChatBotPage />
      <div className='bg-white relative md:flex justify-center  py-6 sm:py-12'>
        <Statistic
          title='Server Status'
          value={serverPrefix.Status}
          precision={0}
          valueStyle={{ color: serverPrefix.Color }}
          prefix={serverPrefix.Icon}
          suffix='|'
        />
        <div>{/* <Text className='text-xl text-black'>abc</Text> */}</div>
      </div>
    </div>
  )
}
