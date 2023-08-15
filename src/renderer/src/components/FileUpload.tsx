import { ChangeEvent } from 'react'
import { useFileContext } from '../contexts/FileContext'

function FileUpload(): JSX.Element {
  const { selectedFile, updateSrc } = useFileContext()

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0]
    if (file != null) {
      const filePath = file.path || file.name;
      updateSrc(filePath);
    }
  }

  return (
    <div className="upload">
      <input
        type="file"
        accept=".txt, .srt"
        onChange={handleFileChange} />
        {selectedFile && <p>{selectedFile}</p>}
    </div>
  )
}

export default FileUpload
