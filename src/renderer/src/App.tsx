import FileUpload from './components/FileUpload'
import { WordFreq } from 'src/model/tools'
import { useState } from 'react'
import Process from './views/Process'
import Analyze from './views/Analyze'
import InputText from './views/InputText'

declare global { //TODO: This is probably not the correct/best way to declare types
  interface Window {
    api: {
      trimSRTFile: () => string
      trimSRT: () => string
      previewFile: (filePath: string, lines: number) => Promise<string[]>
      openSaveDialog: () => Promise<string>
      saveFile: (filePath: string, content: string) => Promise<string>
      saveFileTemp: (filePath: string, content: string) => Promise<string>,
      wordFrequency: (filePath: string) => Promise<WordFreq[]>,
      getDecks: () => Promise<Deck[]>
      createClozeCard: (deck: string, sentence: string, clozeWords: string[]) => Promise<void>,
      usedInSentences: (filePath: string, argWord: string) => Promise<string[]>,
      translate: (text: string, targetLanguage: string) => Promise<string[]>
    }
  }

  interface Deck {
    id: number;
    name: string;
  }
}

enum Mode { process, analyze, inputText }

function App(): JSX.Element {

  const [mode, setMode] = useState<Mode>(Mode.analyze)

  return (
    <>
      {/* <button onClick={async () => {
        console.log(await window.api.translate("pretty", "es"))
      }}>Pretty</button>
      <button onClick={async () => {
        console.log(await window.api.translate("big", "es"))
      }}>Big</button> */}
      <FileUpload />
      <div className="tabs">
        <button disabled={mode == Mode.analyze} onClick={() => setMode(Mode.analyze)}>Analyze</button>
        <button disabled={mode == Mode.process} onClick={() => setMode(Mode.process)}>Process</button>
        <button disabled={mode == Mode.inputText} onClick={() => setMode(Mode.inputText)}>Input Text</button>
      </div>
      <div className="container">
        {/* <h1 className="hero-text">📖 LangTool</h1> */}
        {mode === Mode.analyze && <Analyze />}
        {mode === Mode.process && <Process />}
        {mode === Mode.inputText && <InputText />}
      </div>
    </>
  )
}

export default App
