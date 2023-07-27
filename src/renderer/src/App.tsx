import FileUpload from './components/FileUpload'
import FilePreview from './components/FilePreview'
import FileActions from './components/FileActions'
import { useFileContext } from './contexts/FileContext'
import { WordFreq } from 'src/model/tools'

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

function App(): JSX.Element {
  const { selectedFile, srcPreview, resultPreview } = useFileContext()

  return (
    <div className="container">
      <h1 className="hero-text">📖 LangTool</h1>
      <FileUpload />
      <FileActions />
      {selectedFile && (
        <div className="previews">
          <div>
            <h2>Source</h2>
            <FilePreview previewLines={srcPreview} />
          </div>
          <div>
            <h2>Result</h2>
            <FilePreview previewLines={resultPreview} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
