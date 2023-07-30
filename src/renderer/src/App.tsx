import FileUpload from './components/FileUpload'
import FilePreview from './components/FilePreview'
import FileActions from './components/FileActions'
import { useFileContext } from './contexts/FileContext'
import { WordFreq } from 'src/model/tools'
import { useState } from 'react'
import Process from './modes/Process'
import Analyze from './modes/Analyze'

declare global {
  interface Window {
    api: {
      trimSRTFile: () => string
      trimSRT: () => string
      previewFile: (filePath: string) => Promise<string[]>
      openSaveDialog: () => Promise<string>
      saveFile: (filePath: string, content: string) => Promise<string>
      saveFileTemp: (filePath: string, content: string) => string,
      wordFrequency: (filePath: string) => Promise<WordFreq[]>,
    }
  }
}

enum Mode { process, analyze }

function App(): JSX.Element {
  /*   const { selectedFile, srcPreview, resultPreview } = useFileContext() */

  const [mode, setMode] = useState<Mode>(Mode.analyze)


  return (
    <>
      <FileUpload />
      <div className="tabs">
        <button disabled={mode == Mode.process} onClick={() => setMode(Mode.process)}>Process</button>
        <button disabled={mode == Mode.analyze} onClick={() => setMode(Mode.analyze)}>Analyze</button>
      </div>
      <div className="container">
        {/* <h1 className="hero-text">📖 LangTool</h1> */}
        {mode === Mode.analyze && <Analyze />}
        {mode === Mode.process && <Process />}
      </div>
    </>
  )
}

export default App
