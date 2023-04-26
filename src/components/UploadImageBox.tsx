import { postImage } from '@/API/API'
import {
  Upload,
  Progress,
  UploadFile,
  Modal,
  Row,
  Col,
  Divider,
  Tooltip
} from 'antd'
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

const sortName = (name: string) => {
  switch (name) {
    case 'Acne and Rosacea Photos':
      return 'Acne and Rosacea'
    case 'Bullous Disease Photos':
      return 'Bullous Disease'
    case 'Cellulitis Impetigo and other Bacterial Infections':
      return 'Cellulitis Impetigo'
    case 'Eczema Photos':
      return 'Eczema'
    case 'Melanoma Skin Cancer Nevi and Moles':
      return 'Melanoma Skin Cancer'
    case 'Poison Ivy Photos and other Contact Dermatitis':
      return 'Contact Dermatitis'
    case 'Scabies Lyme Disease and other Infestations and Bites':
      return 'Scabies Lyme Disease'
    case 'Seborrheic Keratoses and other Benign Tumors':
      return 'Seborrheic Keratoses'
    case 'Systemic Disease':
      return 'Systemic Disease'
    case 'Tinea Ringworm Candidiasis and other Fungal Infections':
      return 'Fungal Infections'
    case 'Urticaria Hives':
      return 'Urticaria Hives'
    case 'Vasculitis Photos':
      return 'Vasculitis Photos'
    case 'Warts Molluscum and other Viral Infections':
      return 'Other Viral Infections'
    case 'Normal':
      return 'Normal'
    default:
      return 'Not Found'
  }
}

export const UploadImageBox = (self_event: UploadImageBoxModel) => {
  const [defaultFileList, setDefaultFileList] = useState([])
  const [progress, setProgress] = useState(0)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [message, setMessage] = useState<any>()

  const colorList = ['#45B39D', '#3498DB', '#95A5A6', '#A569BD', '#EC7063']

  const uploadImage = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options

    const fmData = new FormData()
    fmData.append('image', file)

    let listEle = []
    for (let i = 0; i < 5; i++) {
      listEle.push(
        <Row key={i}>
          <Col span={8} className={'pb-2 h-10'}>
            ...
          </Col>
          <Col span={16}>
            <Progress percent={0} status='active' strokeColor={colorList[i]} />
          </Col>
        </Row>
      )
    }

    setMessage(listEle)
    postImage(fmData)
      .then(res => {
        onSuccess('Ok')
        // self_event.onUploadDone(res.data.botMessage)
        if (!res.data.result) {
          let result = (
            <p className='text-orange-700 text-lg'>{res.data.message}</p>
          )
          setMessage(result)
        }
        let listValueName: any[] = []
        let listValue: any[] = []
        let listValueLongName: any[] = []
        if (res.data?.result) {
          res.data?.top5Prediction.map((e: any) => {
            listValueName.push(sortName(e[0]))
            listValue.push(Math.round(e[1] * 1000) / 1000)
            listValueLongName.push(e[0])
          })

          let listEle = []
          for (let i = 0; i < 5; i++) {
            listEle.push(
              <Row key={i}>
                <Col span={10} className={'pb-2 h-10 text-ellipsis'}>
                  <Tooltip placement='topLeft' title={listValueLongName[i]}>
                    {listValueName[i]}
                  </Tooltip>
                </Col>
                <Col span={14}>
                  <Progress
                    percent={listValue[i]}
                    status='active'
                    strokeColor={colorList[i]}
                  />
                </Col>
              </Row>
            )
          }
          setMessage(listEle)
        }
        // setMessage('hi')
      })
      .catch(err => {
        console.log('Eroor: ', err)
        const error = new Error('Some error')
        onError({ err })
        // self_event.onUploadDone("File upload error!")
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
    <div>
      <Upload
        accept='image/*'
        customRequest={uploadImage}
        onChange={handleOnChange}
        listType='picture-card'
        defaultFileList={defaultFileList}
        className='image-upload-grid'
        maxCount={1}
        onPreview={handlePreview}
        // showUploadList={{ showRemoveIcon: false }}
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
      <Divider />
      <div className={'w-2/3'}>{message}</div>
    </div>
  )
}
