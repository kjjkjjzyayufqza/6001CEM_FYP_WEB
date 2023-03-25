import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import { Button, Card } from 'antd'
import {
  ChatItem,
  MessageBox,
  MessageList,
  MessageType
} from 'react-chat-elements'
import 'react-chat-elements/dist/main.css'
const inter = Inter({ subsets: ['latin'] })

export default function Home () {
  const [dataSource, setDataSource] = useState<any>([
    {
      position: 'left',
      type: 'text',
      title: 'Kursat',
      text: 'Give me a message list example !'
    },
    {
      position: 'right',
      type: 'text',
      title: 'Emre',
      text: "That's all."
    }
  ])
  const newItem = {
    position: 'right',
    type: 'text',
    title: 'Emre',
    text: "That's all."
  }
  useEffect(() => {
    console.log(dataSource)
  }, [dataSource])

  return (
    <div
      className='mx-auto flex justify-center p-6 h-screen'
      style={{ backgroundColor: '#E3F3FE' }}
    >
      <div className='max-w-md mx-auto bg-white rounded-xl shadow-md overflow-auto md:max-w-2xl '>
        <div className='md:flex'>
          <div className='md:flex-shrink-0'>
            <img
              className='h-48 w-full object-cover md:h-full md:w-48'
              src='/temp_icon.png'
              alt='Man looking at item at a store'
            />
          </div>
          <div className='p-8'>
            <div className='uppercase tracking-wide text-sm text-indigo-500 font-semibold'>
              Case study
            </div>
            <a
              href='#'
              className='block mt-1 text-lg leading-tight font-medium text-black hover:underline'
            >
              Finding customers for your new business
            </a>
            <p className='mt-2 text-gray-500'>
              Getting a new business off the ground is a lot of hard work. Here
              are five ideas you can use to find your first customers.
            </p>
            <MessageList
              className='message-list'
              lockable={true}
              toBottomHeight={'100%'}
              dataSource={dataSource}
              referance={null}
            />
            <Button onClick={() => setDataSource([...dataSource, newItem])}>
              ADD
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
