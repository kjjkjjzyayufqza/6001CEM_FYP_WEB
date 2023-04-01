import { Avatar, Col, Row } from 'antd'
import React, { Children, FC } from 'react'
import { MessageType } from 'react-chat-elements'

export enum MessageModelType {
  UserMessage,
  BotMessage,
  BotFileMessage
}

export const MessageModel: FC<{ type: MessageModelType; Children?: any }> = ({
  type,
  Children
}) => {
  let botMessage: MessageType = {
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
    ) as any,
    text: 'Hello, what can i help you?'
  }

  let userMessage: MessageType = {
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

  let botFileMessage: MessageType = {
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
    ) as any,
    text: Children
  }

  switch (type) {
    case MessageModelType.UserMessage:
      return userMessage as any
    case MessageModelType.BotMessage:
      return botMessage as any
    case MessageModelType.BotFileMessage:
      return botFileMessage as any
  }
  return <>null</>
}
