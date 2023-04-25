import { BotMessageResponseModel } from '@/MODEL'
import React, { FC, ReactElement, ReactNode, useEffect, useState } from 'react'
import { Button, Divider, Space, Typography, message } from 'antd'
import { BsFillQuestionCircleFill } from 'react-icons/bs'
import { QuestionCircleOutlined } from '@ant-design/icons'
const { Text, Link } = Typography

export const MessageBox: FC<BotMessageResponseModel> = ({
  botMessage,
  result = true
}) => {
  const listResMessage = [
    'According to your question, I deduce that it may be ',
    'I think it might be '
  ]

  const ignore_tag = [
    'greeting',
    'goodbye',
    'thanks',
    'noanswer',
    'options',
    'Identity'
  ]

  const randomNumber = Math.floor(Math.random() * listResMessage.length)

  const [returnMessage, setReturnMessage] = useState<any>('')
  const [suggestionsEle, setSuggestionsEle] = useState<ReactNode>()

  useEffect(() => {
    if (!botMessage?.tag) {
      botMessage?.message && setReturnMessage(botMessage?.message)
    } else {
      if (ignore_tag.includes(botMessage?.tag)) {
        botMessage?.message && setReturnMessage(botMessage?.message)
      } else {
        botMessage?.message &&
          setReturnMessage(
            <>
              {listResMessage[randomNumber]}
              <Text className='text-lg' underline strong>
                {botMessage?.message}
              </Text>
            </>
          )
      }
    }

    if (botMessage?.suggestions?.length) {
      setSuggestionsEle(
        <div>
          <Divider />
          <div className='flex justify-between'>
            <Text className='text-lg'>{botMessage?.suggestionsText}</Text>
            <Button type={'primary'} icon={<QuestionCircleOutlined />} shape="round">
              <Text className='text-white'>
                {botMessage?.tag?.toUpperCase()}
              </Text>
            </Button>
          </div>
          {botMessage.suggestions.map((e, i) => {
            return (
              <div
                key={i}
                className='bg-white dark:bg-slate-800 rounded-md px-2 py-2 ring-1 ring-gray-200 shadow-sm flex mt-2'
              >
                <div>
                  <span className='inline-flex items-center justify-center p-1 bg-emerald-500 rounded-md' />
                </div>
                <Text className='text-zinc-900 dark:text-slate-400 text-sm ml-2'>
                  {e}
                </Text>
              </div>
            )
          })}
          <div className='mt-2'>
            <Text code>
              Note: Please consult your doctor before taking any medication.
            </Text>
          </div>
        </div>
      )
    }
  }, [])

  return (
    <div className='max-w-fit'>
      <Text className='text-lg'>{returnMessage}</Text>
      {suggestionsEle}
    </div>
  )
}
