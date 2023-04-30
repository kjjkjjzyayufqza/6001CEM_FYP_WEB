import moment from 'moment'
import React, { createRef, useEffect, useRef } from 'react'
import { MessageBox, MessageList, MessageType } from 'react-chat-elements'
import { MessageModel, MessageModelType } from './MessageModel'
import { Typography } from 'antd'
const { Title, Paragraph, Text, Link } = Typography
export const ExampleMessageBox = () => {
  const messageListReferance = createRef()

  let botMessage: any = MessageModel({
    type: MessageModelType.BotMessage
  })

  let userMessage: any = MessageModel({
    type: MessageModelType.UserMessage
  })

  botMessage = {
    ...botMessage,
    id: 0,
    date: moment().format(),
    text: (
      <Text className='text-lg'>
        This can be a{' '}
        <Text strong className='text-lg'>
          headache
        </Text>
        , and I suggest you try the following suggestions.
        <Text className='text-lg'>.........</Text>
      </Text>
    )
  }

  userMessage = {
    ...userMessage,
    id: 1,
    date: moment().format(),
    text: <Text className='text-lg'>{'I feel light-headed'}</Text>
  }

  const exampleMessageList: any[] = [userMessage, botMessage]
  return (
    <div>
      <MessageList
        referance={messageListReferance}
        className='message-list'
        lockable={false}
        toBottomHeight={'100%'}
        dataSource={exampleMessageList}
      />
    </div>
  )
}
