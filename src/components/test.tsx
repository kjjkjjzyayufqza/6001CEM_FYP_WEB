import React, { useEffect } from 'react'
import SpeechRecognition, {
  useSpeechRecognition
} from 'react-speech-recognition'

const Dictaphone = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition()

  useEffect(() => {}, [])

  return (
    <>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button
        onClick={() => {
          SpeechRecognition.startListening({ continuous: true,language: 'en-US' })
        }}
      >
        Start
      </button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>{transcript}</p>
      <p>Top</p>
    </>
  )
}
export default Dictaphone
