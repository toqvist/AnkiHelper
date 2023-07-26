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

  const { selectedFile, srcPreview } = useFileContext();

  return (
    <div className="container">
      <h1 className="hero-text">
        📖 LangTool
      </h1>
      <FileUpload />
      <FileActions />
      {selectedFile &&
        <>
          <FilePreview previewLines={["one", "two"]} />
          <FilePreview previewLines={srcPreview} />
        </>
      }
    </div>
  )
}

export default App
