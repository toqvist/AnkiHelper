import FileUpload from './components/FileUpload';
import FilePreview from './components/FilePreview';

function App(): JSX.Element {

  return (
    <div className="container">
      <h1 className="hero-text">
        📖 LangTool
      </h1>
      <FileUpload/>
      <FilePreview/>
    </div>
  )
}

export default App
