import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function BasicSpeechRecognition() {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      console.error('Browser does not support speech recognition');
    } else {
      console.log('Browser supports speech recognition');
    }
  
    console.log('Listening status:', listening);
    console.log('Transcript:', transcript);
  }, [listening, transcript]);
  
  return (
    <div>
      {errorMessage && <p>{errorMessage}</p>}
      <button onClick={() => SpeechRecognition.startListening({ continuous: true, language: 'en-US' })}>
        Start Listening
      </button>
      <button onClick={SpeechRecognition.stopListening}>
        Stop Listening
      </button>
      <button onClick={resetTranscript}>
        Reset
      </button>
      <p>Listening: {listening ? 'Yes' : 'No'}</p>
      <p>Transcript: {transcript}</p>
    </div>
  );
}

export default BasicSpeechRecognition;
