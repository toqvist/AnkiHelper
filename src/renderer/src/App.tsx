import FileUpload from './components/FileUpload';
import FilePreview from './components/FilePreview';
import FileActions from './components/FileActions';


declare global {
  interface Window {
    api: {
      trimSRTFile: any;
      trimSRT: any;
      previewFile: (filePath: string) => Promise<string[]>;
    };
  }
}

function App(): JSX.Element {
  return (
    <div className="container">
      <h1 className="hero-text">
        📖 LangTool
      </h1>
      <FileUpload/>
      <FileActions/>
      <FilePreview/>
    </div>
  )
}

export default App
