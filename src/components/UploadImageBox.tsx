import { postImage } from '@/API/API'
import { Upload, Progress } from 'antd'
import { useState } from 'react'

export default interface UploadImageBoxModel {
  onUploadDone: (message: string) => void
}

export const UploadImageBox = (self_event: UploadImageBoxModel) => {
  const [defaultFileList, setDefaultFileList] = useState([])
  const [progress, setProgress] = useState(0)

  const uploadImage = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options

    const fmData = new FormData()
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (event: any) => {
        const percent = Math.floor((event.loaded / event.total) * 100)
        setProgress(percent)
        if (percent === 100) {
          setTimeout(() => setProgress(0), 1000)
        }
        onProgress({ percent: (event.loaded / event.total) * 100 })
      }
    }
    fmData.append('image', file)
    postImage(fmData)
      .then(res => {
        onSuccess('Ok')
        self_event.onUploadDone(res.data.botMessage)
      })
      .catch(err => {
        console.log('Eroor: ', err)
        const error = new Error('Some error')
        onError({ err })
      })
  }

  const handleOnChange = ({ file, fileList, event }: any) => {
    // console.log(file, fileList, event);
    //Using Hooks to update the state to the current filelist
    setDefaultFileList(fileList)
    //filelist - [{uid: "-1",url:'Some url to image'}]
  }

  return (
    <>
      <Upload
        accept='image/*'
        customRequest={uploadImage}
        onChange={handleOnChange}
        listType='picture-card'
        defaultFileList={defaultFileList}
        className='image-upload-grid'
      >
        {defaultFileList.length >= 1 ? null : <div>Upload Button</div>}
      </Upload>
      {progress > 0 ? <Progress percent={progress} /> : null}
    </>
  )
}
