import FileUpload from './components/FileUpload';
import FilePreview from './components/FilePreview';
import FileActions from './components/FileActions';
import { useFileContext } from './contexts/FileContext';


declare global {
  interface Window {
    api: {
      trimSRTFile: () => string;
      trimSRT: () => string;
      previewFile: (filePath: string) => Promise<string[]>;
      openSaveDialog: () => string;
    };
  }
}

function App(): JSX.Element {

  const { selectedFile, srcPreview, resultPreview } = useFileContext();

  return (
    <div className="container">
      <h1 className="hero-text">
        📖 LangTool
      </h1>
      <FileUpload />
      <FileActions />
      {selectedFile &&
        <div>
          <FilePreview previewLines={["one", "two"]} />
          <FilePreview previewLines={srcPreview} />
          <FilePreview previewLines={resultPreview} />
        </div>
      }
    </div>
  )
}

export default App
