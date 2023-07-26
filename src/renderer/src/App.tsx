import FileUpload from './components/FileUpload'
import FilePreview from './components/FilePreview'
import FileActions from './components/FileActions'
import { useFileContext } from './contexts/FileContext'

declare global {
  interface Window {
    api: {
      trimSRTFile: () => string
      trimSRT: () => string
      previewFile: (filePath: string) => Promise<string[]>
      openSaveDialog: () => Promise<string>
      saveFile: (filePath: string, content: string) => Promise<string>
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
        <div>
          <h2>Source</h2>
          <FilePreview previewLines={srcPreview} />
          <h2>Result</h2>
          <FilePreview previewLines={resultPreview} />
        </div>
      )}
    </div>
  )
}

export default App
