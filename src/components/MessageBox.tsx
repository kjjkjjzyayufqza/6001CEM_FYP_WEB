import { BotMessageResponseModel } from '@/MODEL'
import React, { FC, ReactElement, ReactNode, useEffect, useState } from 'react'
import { Button, Divider, Image, Modal, Space, Typography, message } from 'antd'
import { BsFillQuestionCircleFill } from 'react-icons/bs'
import {
  QuestionCircleOutlined,
  StarFilled,
  SendOutlined
} from '@ant-design/icons'
import { FeedBackBox } from './FeedBackBox'
const { Text, Link } = Typography

interface MessageBoxModel extends BotMessageResponseModel {}

export const MessageBox: FC<MessageBoxModel> = ({ botMessage }, {}) => {
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

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isShowFeedBack, setIsShowFeedBack] = useState<boolean>(true)
  const [modelData, setModelData] = useState<{
    title: string
    description: string
  }>()
  const [isMoreSuggestOpen, setIsMoreSuggestOpen] = useState<boolean>(true)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    if (!botMessage?.tag) {
      botMessage?.message && setReturnMessage(botMessage?.message)
    } else {
      if (ignore_tag.includes(botMessage?.tag)) {
        botMessage?.message && setReturnMessage(botMessage?.message)
      } else {
        setIsShowFeedBack(true)

        let frontMessage = listResMessage[randomNumber]
        if (botMessage.message?.startsWith("I don't quite understand")) {
          const spli: string[] = botMessage.message.split('could be ')
          botMessage.message =
            botMessage.message.split('could be ')[spli.length - 1]
          frontMessage =
            "I don't quite understand what you're describing, but it could be "
        }

        botMessage?.message &&
          setReturnMessage(
            <>
              {frontMessage}
              <Text className='text-lg' underline strong>
                {botMessage?.message}
              </Text>
            </>
          )
      }
    }

    if (botMessage?.suggestions?.length) {
      setModelData({
        title: botMessage.tag ?? '',
        description: botMessage.description ?? ''
      })
      const maxSuggestionCount = 3
      let _otherSuggest: any[] = []
      let suggests = botMessage?.suggestions.map((e, i) => {
        if (i < maxSuggestionCount) {
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
        } else {
          _otherSuggest.push(
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
        }
      })
      setSuggestionsEle(
        <div>
          <Divider />
          <div className='flex justify-between'>
            <Text className='text-lg'>{botMessage?.suggestionsText}</Text>
            <Button
              type={'primary'}
              icon={<QuestionCircleOutlined />}
              shape='round'
              onClick={showModal}
            >
              <Text className='text-white'>
                {botMessage?.tag?.toUpperCase()}
              </Text>
            </Button>
          </div>
          {suggests}
          <div className='mt-2'>
            <Text code>
              Note: Please consult your doctor before taking any medication.
            </Text>
          </div>
          <div className='bg-white dark:bg-slate-800 rounded-md px-2 py-2 ring-1 ring-gray-200 shadow-sm mt-5'>
            {isMoreSuggestOpen && (
              <div className='mt-2'>
                <Button
                  style={{ backgroundColor: '#efefef' }}
                  icon={<StarFilled style={{ color: '#2499EA' }} />}
                  shape='round'
                  onClick={() => {
                    setIsMoreSuggestOpen(e => !e)
                    PubSub.publish(
                      'getMoreSuggest',
                      <div>
                        <Text className='text-lg'>
                          Okay, here's more suggest to helping{' '}
                          <Text className='text-lg' strong underline>
                            {botMessage?.message}
                          </Text>
                          !
                        </Text>
                        {_otherSuggest}
                      </div>
                    )
                  }}
                >
                  <Text className='text-black'>
                    Do you want more suggestion helping with{' '}
                    {botMessage?.message} ?
                  </Text>
                </Button>
              </div>
            )}
            <div className='mt-2'>
              <Button
                style={{
                  backgroundColor: '#efefef'
                }}
                icon={<SendOutlined style={{ color: '#2499EA' }} />}
                shape='round'
                onClick={() => {}}
              >
                <Text className='text-black'>
                  Do you want to get information about the{' '}
                  {SwitchDoctorCate(botMessage?.message!)} nearest you?
                </Text>
              </Button>
            </div>
          </div>
        </div>
      )
    }
  }, [isMoreSuggestOpen])

  return (
    <div className='max-w-fit'>
      <Text className='text-lg'>{returnMessage}</Text>
      {suggestionsEle}
      <Modal
        title={modelData?.title}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key='back' onClick={handleOk} type={'primary'}>
            OK
          </Button>
        ]}
      >
        <Image src='des.jpg'></Image>
        <div className='my-5'>
          <Text>{modelData?.description}</Text>
        </div>
      </Modal>
      {isShowFeedBack && <FeedBackBox></FeedBackBox>}
    </div>
  )
}

function SwitchDoctorCate (type: string): string {
  const AllChatClass = [
    'infected wound',
    'stomach ache',
    'acne',
    'joint pain',
    'blurry vision',
    'feeling dizzy',
    'foot ache',
    'head ache',
    'ear ache',
    'hair falling out',
    'emotional pain',
    'knee pain',
    'skin issue',
    'muscle pain',
    'feeling cold',
    'back pain',
    'chest pain',
    'shoulder pain',
    'hard to breath',
    'cough',
    'injury from sports',
    'neck pain',
    'internal pain',
    'open wound',
    'body feels weak'
  ]

  switch (type) {
    case AllChatClass[0]:
      //外科医生
      return 'General Surgeon'
    case AllChatClass[1]:
      //普通科
      return 'General Practitioner'
    case AllChatClass[2]:
      //皮肤科
      return 'Dermatologists'
    case AllChatClass[3]:
      //骨科医生
      return 'Orthopedic Surgeon'
    case AllChatClass[4]:
      //眼科医生
      return 'Ophthalmologist'
    case AllChatClass[5]:
      //普通科
      return 'General Practitioner'
    case AllChatClass[6]:
      //内科医生
      return 'Internal Medicine Physician'
    case AllChatClass[7]:
      //普通科
      return 'General Practitioner'
    case AllChatClass[8]:
      //耳鼻喉科医生
      return 'Otolaryngologist'
    case AllChatClass[9]:
      //皮肤科
      return 'Dermatologists'
    case AllChatClass[10]:
      //心理医生
      return 'Psychologist'
    case AllChatClass[11]:
      //骨科医生
      return 'Orthopedic Surgeon'
    case AllChatClass[12]:
      //皮肤科
      return 'Dermatologists'
    case AllChatClass[13]:
      //内科医生
      return 'Internal Medicine Physician'
    case AllChatClass[14]:
      //内科医生
      return 'Internal Medicine Physician'
    case AllChatClass[15]:
      //内科医生
      return 'Internal Medicine Physician'
    case AllChatClass[16]:
      //骨科医生
      return 'Orthopedic Surgeon'
    case AllChatClass[17]:
      //内科医生
      return 'Internal Medicine Physician'
    case AllChatClass[18]:
      //内科医生
      return 'Internal Medicine Physician'
    case AllChatClass[19]:
      //普通科
      return 'General Practitioner'
    case AllChatClass[20]:
      //普通科
      return 'General Practitioner'
    case AllChatClass[21]:
      //普通科
      return 'General Practitioner'
    case AllChatClass[22]:
      //普通科
      return 'General Practitioner'
    case AllChatClass[23]:
      //普通科
      return 'General Practitioner'
    case AllChatClass[24]:
      //外科医生
      return 'General Surgeon'
    case AllChatClass[25]:
      //普通科
      return 'General Practitioner'
    default:
      return 'none'
  }
}
