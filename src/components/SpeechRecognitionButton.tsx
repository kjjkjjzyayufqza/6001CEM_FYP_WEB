import React, { FC, ReactNode, useEffect, useState } from 'react'
import SpeechRecognition, {
  useSpeechRecognition
} from 'react-speech-recognition'
import {
  AudioOutlined,
  LoadingOutlined,
  SettingFilled,
  SmileOutlined,
  SyncOutlined,
  ChromeOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined
} from '@ant-design/icons'
import { Button, Popover, Space, Tooltip, message } from 'antd'

interface SpeechRecognitionButtonModel {
  onUpdateText: (e: string) => void
}

const SpeechRecognitionButton: FC<SpeechRecognitionButtonModel> = ({
  onUpdateText
}) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition()

  const [messageApi, contextHolder] = message.useMessage()
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    messageApi.open({
      type: 'warning',
      content: 'your browser not support Web Speech API'
    })
  }

  const [audioIconButtonLoading, setAudioIconButtonLoading] =
    useState<boolean>(false)

  useEffect(() => {
    onUpdateText(transcript)
  }, [transcript])

  useEffect(() => {}, [audioIconButtonLoading])

  const updateText = (boo: boolean) => {
    resetTranscript()
    if (!boo) {
      setAudioIconButtonLoading(e => false)
    } else {
      setAudioIconButtonLoading(e => true)
    }
  }

  const startListening = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: 'en-US'
    })
  }

  const stopListening = () => {
    SpeechRecognition.stopListening()
    resetTranscript()
  }

  // 获取设备列表
  const enumerateDevices = async () => {
    try {
      const devices = await global.navigator.mediaDevices.enumerateDevices()
      return devices
    } catch (errMsg) {
      return []
    }
  }

  // 释放 mediaStream
  const stopStreamTracks = (stream: any) => {
    if (!stream || !stream.getTracks) {
      return
    }
    try {
      const tracks = stream.getTracks()
      tracks.forEach((it: any) => {
        try {
          it.stop()
        } catch (errMsg) {
          // debugger;
        }
      })
    } catch (errMsg) {
      // debugger;
    }
  }

  // 请求 摄像头/麦克风 权限
  const requestPermission = async () => {
    const devices = await enumerateDevices()
    const constraints = devices.reduce(
      (info, device) => {
        if (!device) {
          return info
        }
        if ('audioinput' === device.kind) {
          return { audio: true }
        }
        return info
      },
      { audio: false }
    )
    try {
      const stream = await global.navigator.mediaDevices.getUserMedia(
        constraints
      )
      stopStreamTracks(stream)
    } catch (errMsg: any) {
      if (errMsg && 'NotAllowedError' === errMsg.name) {
        return false
      }
    }

    return true
  }

  return (
    <div>
      <Popover
        content={
          <Space>
            <Button
              type={'primary'}
              icon={<PlayCircleOutlined />}
              onClick={() => {
                // requestPermission().then(res => {
                //   console.log(res)
                // })
                startListening()
                updateText(true)
              }}
            >
              Start
            </Button>
            <Button
              type={'primary'}
              icon={<PauseCircleOutlined />}
              onClick={() => {
                stopListening()
                updateText(false)
              }}
            >
              Stop
            </Button>
          </Space>
        }
        title='Voice'
        trigger='click'
      >
        <div>
          {audioIconButtonLoading ? (
            <ChromeOutlined
              style={{
                fontSize: 16,
                color: '#1890ff'
              }}
              onClick={() => {}}
              spin
            />
          ) : (
            <AudioOutlined
              style={{
                fontSize: 16,
                color: '#1890ff'
              }}
              onClick={() => {}}
            />
          )}
        </div>
      </Popover>
      {/* <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button
        onClick={() => {
          SpeechRecognition.startListening({
            continuous: true,
            language: 'en-US'
          })
        }}
      >
        Start
      </button>
      <button onClick={() => SpeechRecognition.stopListening()}>Stop</button>
      <button onClick={() => resetTranscript()}>Reset</button>
      <p>{transcript}</p>
      <p>Top</p> */}
      {contextHolder}
    </div>
  )
}
export default SpeechRecognitionButton
