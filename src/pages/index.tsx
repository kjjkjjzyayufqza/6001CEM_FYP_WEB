import { Button, Typography } from 'antd'
import ChatBotPage from './ChatBotPage'
import 'react-chat-elements/dist/main.css'

const { Text, Link } = Typography
export default function Home () {
  return (
    <div className=''>
      {/* <div className='mx-auto flex flex-wrap justify-between p-5 flex-col md:flex-row items-center bg-black'>
        <div>
          <img
            src='https://flowbite.com/docs/images/logo.svg'
            className='h-8 mr-3'
          />
          <Text className='self-center text-2xl font-semibold whitespace-nowrap text-white'>
            Flowbite
          </Text>
        </div>
        <div className='flex md:order-2'>
          <Button>Get started</Button>
        </div>
        <div></div>
      </div> */}
      <ChatBotPage />
    </div>
  )
}
