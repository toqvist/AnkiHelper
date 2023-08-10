import { ChangeEvent } from 'react'
import { useFileContext } from '../contexts/FileContext'

function FileUpload(): JSX.Element {
  const { selectedFile, updateSrc } = useFileContext()

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0]
    if (file != null) {
      updateSrc(file.name)
    }
  }

  return (
    <div className="upload">
      <input type="file" accept=".txt, .srt" onChange={handleFileChange} />
      {/* {selectedFile && <p>{selectedFile}</p>} */}
      {selectedFile}
    </div>
  )
}

export default FileUpload
