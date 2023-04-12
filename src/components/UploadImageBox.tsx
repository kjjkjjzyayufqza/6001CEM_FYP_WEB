import { postImage } from '@/API/API'
import { Upload, Progress, UploadFile, Modal } from 'antd'
import { useState } from 'react'
import type { RcFile, UploadProps } from 'antd/es/upload'

export default interface UploadImageBoxModel {
  onUploadDone: (message: string) => void
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })

export const UploadImageBox = (self_event: UploadImageBoxModel) => {
  const [defaultFileList, setDefaultFileList] = useState([])
  const [progress, setProgress] = useState(0)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')

  const uploadImage = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options

    const fmData = new FormData()
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
        self_event.onUploadDone("File upload error!")
      })
  }

  const handleOnChange = ({ file, fileList, event }: any) => {
    // console.log(file.status)
    //Using Hooks to update the state to the current filelist
    setDefaultFileList(fileList)
    //filelist - [{uid: "-1",url:'Some url to image'}]
  }

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
    )
  }

  const handleCancel = () => setPreviewOpen(false)

  return (
    <>
      <Upload
        accept='image/*'
        customRequest={uploadImage}
        onChange={handleOnChange}
        listType='picture-card'
        defaultFileList={defaultFileList}
        className='image-upload-grid'
        maxCount={1}
        onPreview={handlePreview}
        showUploadList={{ showRemoveIcon: false }}
        style={{ width: '1000px', height: '1000px' }}
      >
        {defaultFileList.length >= 1 ? null : <div>Upload Button</div>}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt='example' style={{ width: '100%' }} src={previewImage} />
      </Modal>
      {progress > 0 ? <Progress percent={progress} /> : null}
    </>
  )
}
