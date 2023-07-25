import FileUpload from './components/FileUpload';
import FilePreview from './components/FilePreview';
import FileActions from './components/FileActions';

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
