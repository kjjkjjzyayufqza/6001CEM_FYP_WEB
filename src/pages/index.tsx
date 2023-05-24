import {
  Button,
  Collapse,
  Radio,
  Space,
  Statistic,
  Tour,
  TourProps,
  Typography
} from 'antd'
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
  Link as Links,
  animateScroll as scroll,
  scrollSpy,
  scroller
} from 'react-scroll'
const { Title, Paragraph, Text, Link } = Typography
const { Panel } = Collapse
import '../i18n/i18n'
import { useTranslation } from 'react-i18next'
export default function Home () {
  const [serverPrefix, setServerPrefix] = useState<{
    Status: any
    Icon: ReactNode | null
    Color: string
  }>({ Status: 'Checking', Icon: <SyncOutlined spin />, Color: '#AAAAAA' })
  const { t, i18n } = useTranslation()
  const diseaseList = [
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
  ].map((e, i) => {
    return <li key={i}>{t(e)}</li>
  })

  const skinDiseaseList = [
    'Acne and Rosacea Photos',
    'Bullous Disease Photos',
    'Cellulitis Impetigo and other Bacterial Infections',
    'Eczema Photos',
    'Melanoma Skin Cancer Nevi and Moles',
    'Normal',
    'Poison Ivy Photos and other Contact Dermatitis',
    'Scabies Lyme Disease and other Infestations and Bites',
    'Seborrheic Keratoses and other Benign Tumors',
    'Systemic Disease',
    'Tinea Ringworm Candidiasis and other Fungal Infections',
    'Urticaria Hives',
    'Vasculitis Photos',
    'Warts Molluscum and other Viral Infections'
  ].map((e, i) => {
    return <li key={i}>{t(e)}</li>
  })

  const ref1 = useRef(null)
  const ref2 = useRef(null)
  const ref3 = useRef(null)

  const [touropen, setTourOpen] = useState<boolean>(false)

  const steps: TourProps['steps'] = [
    {
      title: 'Enter text',
      description: 'Please describe what part of your body feels uncomfortable',
      target: () => ref1.current
    }
    // {
    //   title: 'Save',
    //   description: 'Save your changes.',
    //   target: () => ref2.current
    // },
    // {
    //   title: 'Other Actions',
    //   description: 'Click to see other actions.',
    //   target: () => ref3.current
    // }
  ]

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

  const options = [
    { label: 'EN', value: 'us' },
    { label: '繁', value: 'zh_hk' }
  ]

  const [i18nValue, setI18nValue] = useState('us')

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
          <img src='logo-no-background.png' className='h-8 mr-3' />
          <Text className='self-center text-2xl font-semibold whitespace-nowrap text-white'>
            {t('Health Chat')}
          </Text>
        </div>
        <div className='flex'>
          <Space>
            <Links activeClass='active' to='test1' spy={true} smooth={true}>
              <Button type={'ghost'} onClick={() => {}}>
                <Text className='text-lg text-white' strong>
                  {t('Introduction'.toUpperCase())}
                </Text>
              </Button>
            </Links>
            <Links activeClass='active' to='test2' spy={true} smooth={true}>
              <Button type={'ghost'} onClick={() => {}}>
                <Text className='text-lg text-white' strong>
                  {t('Chat'.toUpperCase())}
                </Text>
              </Button>
            </Links>
            <Links activeClass='active' to='test3' spy={true} smooth={true}>
              <Button type={'ghost'} onClick={() => {}}>
                <Text className='text-lg text-white' strong>
                  {t('Other'.toUpperCase())}
                </Text>
              </Button>
            </Links>
          </Space>
        </div>
        <div className='flex md:order-2 items-center'>
          <Radio.Group
            options={options}
            onChange={e => {
              setI18nValue(e.target.value)
              i18n.changeLanguage(e.target.value)
              localStorage.setItem('i18nValue', e.target.value)
            }}
            value={i18nValue}
            optionType='button'
            buttonStyle='solid'
            size={'small'}
            className='mr-10'
          />
          <Button
            type={'ghost'}
            style={{ backgroundColor: '#0078FF', height: '3em' }}
            onClick={() => {
              console.log('hi')
            }}
          >
            <Link
              className=''
              href='https://onedrive.live.com/download?cid=0A1E80E34D0A9499&resid=A1E80E34D0A9499%21178&authkey=ADkgz74cunti7zY'
            >
              <Text className='text-xl text-white'>Download APP</Text>
            </Link>
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
                    {t('A intelligent medical chatbots')}
                  </Text>
                </div>
                <div className='mt-3'>
                  <Button
                    style={{ backgroundColor: '#FF6A00', height: '4em' }}
                    onClick={() => {
                      setTourOpen(true)
                    }}
                    type={'ghost'}
                  >
                    <Text className='text-2xl text-white'>
                      {t('Get Started')}
                    </Text>
                  </Button>
                </div>
                <div>
                  <Paragraph className='mt-3'>
                    {t('Provide suggestions and')}{' '}
                    <Text code>
                      {t('recommend doctors (Mobile app required)')}
                    </Text>
                  </Paragraph>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Element name='test1'></Element>
      <div className='relative md:flex justify-center bg-[#F6F7FC] py-6 sm:py-12'>
        <div className='max-w-md mx-auto md:max-w-6xl'>
          <div className='md:flex'>
            <div className='md:mx-auto bg-white  rounded-lg px-6 py-8 ring-1 ring-slate-900/5 '>
              <div>
                <Paragraph className='text-xl'>
                  {t('The chatbot automatically determines the')}{' '}
                  <Text strong className='text-xl'>
                    {t('diseases')}
                  </Text>{' '}
                  {t(
                    "the user has based on the user's input and makes corresponding"
                  )}{' '}
                  <Text strong className='text-xl'>
                    {t('suggestions')}
                  </Text>
                  . {t('Also, if the user asks about a')}{' '}
                  <Text strong className='text-xl'>
                    {t('skin problem')}
                  </Text>
                  {', '}
                  {t('the chatbot asks for a photo for further')}{' '}
                  <Text strong className='text-xl'>
                    {t('disease prediction')}
                  </Text>
                  . {t('The following are currently supported')}
                </Paragraph>
              </div>
              <div className='ring-1 ring-slate-900/5'>
                <Paragraph>
                  <ul style={{ marginLeft: '1em' }}>
                    {diseaseList.map((e, i) => {
                      if (i < 8) {
                        return e
                      }
                    })}
                  </ul>
                  <Collapse ghost>
                    <Panel
                      header={
                        <Text style={{ color: '#0089FF' }}>{t('Expand')}</Text>
                      }
                      key='1'
                    >
                      <ul>
                        {diseaseList.map((e, i) => {
                          if (i > 8) {
                            return e
                          }
                        })}
                      </ul>
                    </Panel>
                  </Collapse>
                </Paragraph>
              </div>
              <div>
                <Paragraph className='text-xl'>
                  {t('For skin disease prediction, there are the following')}
                </Paragraph>
                <Paragraph className='ring-1 ring-slate-900/5'>
                  <ul style={{ marginLeft: '1em' }}>
                    {skinDiseaseList.map((e, i) => {
                      if (i < 8) {
                        return e
                      }
                    })}
                  </ul>
                  <Collapse ghost>
                    <Panel
                      header={
                        <Text style={{ color: '#0089FF' }}>{t('Expand')}</Text>
                      }
                      key='1'
                    >
                      <ul>
                        {skinDiseaseList.map((e, i) => {
                          if (i > 8) {
                            return e
                          }
                        })}
                      </ul>
                    </Panel>
                  </Collapse>
                </Paragraph>
              </div>
            </div>
            <div className='relative md:w-20'></div>
            <div
              className='md:mx-auto bg-gray-50 dark:bg-slate-800 rounded-lg p-4 ring-1 ring-slate-900/5 shadow-xl'
              style={{ height: '500px' }}
            >
              <ExampleMessageBox />
            </div>
          </div>
        </div>
      </div>
      <Element name='test2'></Element>
      <ChatBotPage tourRef={ref1} />
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
      <Element name='test3'></Element>
      <Tour open={touropen} onClose={() => setTourOpen(false)} steps={steps} />
    </div>
  )
}
