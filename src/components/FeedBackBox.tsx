import { Button, Space } from 'antd'
import React, { ReactElement, useEffect, useState } from 'react'

export const FeedBackBox = () => {
  const [isClick, setIsClick] = useState<boolean>(false)

  let returnEle: ReactElement = <></>

  useEffect(() => {}, [])

  const UpdateDisplay = () => {
    setIsClick(true)
  }

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
          <Button onClick={() => UpdateDisplay()} size={'small'}>
            No
          </Button>
        </Space>
      </div>
    )
  } else {
    returnEle = (
      <div className='mt-2'>
        <div className='text-slate-500 text-sm'>Thanks for your feedback.</div>
      </div>
    )
  }
  return returnEle
}
