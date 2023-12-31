import FileUpload from './components/FileUpload'
import { WordFreq } from 'src/model/tools'
import { useState } from 'react'
import Process from './views/Process'
import Analyze, { Sentence, Word } from './views/Analyze'
import InputText from './views/InputText'
import { WebContents, ipcRenderer } from 'electron'

declare global {
  //TODO: This is probably not the correct/best way to declare types
  interface Window {
    api: {
      trimSRTFile: (filePath: string) => string
      trimSRT: (content: string) => string
      previewFile: (filePath: string, lines: number) => Promise<string[]>
      readFileAsSentences: (filePath: string, lines: number) => Promise<Sentence[]>
      openSaveDialog: () => Promise<string>
      saveFile: (filePath: string, content: string) => Promise<string>
      saveFileTemp: (filePath: string, content: string) => Promise<string>
      wordFrequency: (filePath: string) => Promise<WordFreq[]>
      getDecks: () => Promise<Deck[]>
      createClozeCard: (deck: string, clozeWords: Word[]) => Promise<void>
      isWordNew: (word: string, deck: string) => Promise<boolean>
      usedInSentences: (filePath: string, argWord: string) => Promise<Sentence[]>
      translate: (text: string, targetLanguage: string) => Promise<string[]>
      getCurrentWebContents: () => WebContents
    }
  }

  interface Deck {
    id: number
    name: string
  }
}

enum Mode {
  process,
  analyze,
  inputText
}

function App(): JSX.Element {
  const [mode, setMode] = useState<Mode>(Mode.analyze)

  return (
    <>
      <div>
        <div className="tabs">
          <button
            className={`disabled:opacity-100 ${
              mode === Mode.analyze ? 'bg-slate-600' : 'bg-slate-700'
            }`}
            disabled={mode == Mode.analyze}
            onClick={() => setMode(Mode.analyze)}
          >
            🔎 Analyze
          </button>
          <button
            className={`disabled:opacity-100 ${
              mode === Mode.inputText ? 'bg-slate-600' : 'bg-slate-700'
            }`}
            disabled={mode == Mode.inputText}
            onClick={() => setMode(Mode.inputText)}
          >
            📃 Input Text
          </button>
          <button
            className={`disabled:opacity-100 ${
              mode === Mode.process ? 'bg-slate-600' : 'bg-slate-700'
            }`}
            disabled={mode == Mode.process}
            onClick={() => setMode(Mode.process)}
          >
            🥽 Process
          </button>
        </div>
        <FileUpload />
      </div>
      <div>
        {mode === Mode.analyze && <Analyze />}
        {mode === Mode.inputText && <InputText />}
        {mode === Mode.process && <Process />}
      </div>
    </>
  )
}

export default App

//TODO: FTR/ Alternative filetypes: pdf, epub, mobi
//TODO: FTR/ Basic note creation
//TODO: ENH/ Visual overhaul
//TODO: ENH/ Back-side of cloze cards
//TODO: ENH/ Cloze input box should closed when another one opens
//TODO: BUG/ Input box not focused when cloze selected
//TODO: FTR/ More languages/add languages to selector
//TODO: ENH/ Loading file freezes up program until it's done
//TODO: BUG/ Save file doesn't work anymore
//TODO: BUG/Reselecting 'Deck' again does not update deck state
