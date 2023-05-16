import { addFeedBack, getAllClass } from '@/API/API'
import { Button, Input, Modal, Select, Space, message } from 'antd'
import React, { ReactElement, useEffect, useState } from 'react'
import { Divider, Typography } from 'antd'

const { Title, Paragraph, Text, Link } = Typography
const { TextArea } = Input
export const FeedBackBox = () => {
  const [isClick, setIsClick] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectValue, setSelectValue] = useState<any[]>()
  const [selectDis, setSelectDis] = useState<string>()
  const [description, setDescription] = useState<string>()
  const [isSubmitFB, setIsSubmitFB] = useState<boolean>(false)

  const [messageApi, contextHolder] = message.useMessage()

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
    console.log(selectDis, description)
    if (selectDis && description) {
      addFeedBack({ category: selectDis, description: description })
        .then(res => {
          messageApi.open({
            type: 'success',
            content: 'Thank you for you feedback'
          })
          messageApi.open({
            type: 'success',
            content: 'Disease data uploaded'
          })
          setIsClick(true)
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      messageApi.open({
        type: 'success',
        content: 'Thank you for you feedback'
      })
      setIsClick(true)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  let returnEle: ReactElement = <></>

  useEffect(() => {}, [])

  const UpdateDisplay = () => {
    setIsClick(true)
  }

  const onChange = (value: string) => {
    console.log(`selected ${value}`)
  }

  const onSearch = (value: string) => {
    console.log('search:', value)
  }

  const initSelectValue = async () => {
    getAllClass()
      .then(res => {
        // console.log(res.data)
        let data: any[] = []
        res.data.AllChatClass.map((e: string) => {
          let temp = { value: e, label: e }
          data.push(temp)
        })
        setSelectValue(data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {}, [])

  if (!isClick) {
    returnEle = (
      <div className='mt-2'>
        <div className='text-slate-500 text-sm'>
          Does this help you solve the problem?
        </div>
        <Space>
          <Button onClick={() => UpdateDisplay()} size={'small'}>
            Yes
          </Button>
          <Button
            onClick={() => {
              initSelectValue()
                .then(() => {
                  showModal()
                })
                .catch(() => {
                  showModal()
                })
            }}
            size={'small'}
          >
            No
          </Button>
        </Space>
        <Modal
          centered
          title='Feedback'
          open={isModalOpen}
          onOk={() => {
            handleOk()
          }}
          onCancel={handleCancel}
        >
          <div>
            <Text>
              Thank you for using this application. We take user feedback very
              seriously and try to add improvements and make refinements.
            </Text>
          </div>

          <div className='mt-1'>
            <Text strong>
              If you would like to provide us with some information, we will
              collect it and use it to improve our application, thank you very
              much.
            </Text>
          </div>
          <div className='mt-3 '>
            <Text className='text-lg'>Feedback content</Text>
            <Text className='text-md' code>
              (Optional)
            </Text>
          </div>
          <TextArea
            placeholder='Input here.....'
            autoSize={{ minRows: 3, maxRows: 5 }}
            className='mt-2'
          />
          <div className='mt-10'>
            <Text className='text-sm'>
              Here are some of the common diseases that we are currently able to
              classify, and we would appreciate it if you would provide some
              description of your disease!
            </Text>
            <Text className='text-md' code>
              (Optional)
            </Text>
          </div>
          <div className='mt-3'>
            <div>
              <Text className='text-lg'>Diseases : </Text>
            </div>
            <Select
              showSearch
              placeholder='Select a diseases'
              optionFilterProp='children'
              onChange={setSelectDis}
              onSearch={onSearch}
              className='w-40'
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={selectValue}
            />
            <TextArea
              onChange={e => setDescription(e.target.value)}
              placeholder={`Example: I feel a little upset in my stomach, but I'm not sure where the pain is?`}
              autoSize={{ minRows: 3, maxRows: 5 }}
              className='mt-2'
            />
          </div>
        </Modal>
      </div>
    )
  } else {
    returnEle = (
      <div className='mt-2'>
        <div className='text-slate-500 text-sm'>Thanks for your feedback.</div>
      </div>
    )
  }
  return (
    <>
      {returnEle}
      {contextHolder}
    </>
  )
}
