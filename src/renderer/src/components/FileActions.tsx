import { useFileContext } from '../contexts/FileContext'
import { WordFreq } from 'src/model/tools'

interface Action {
  label: string
  function: Function
}

function FileActions(): JSX.Element {
  const { selectedFile, updateResult, openSaveDialog, resultToSource, result } = useFileContext()

  function getFileExtension(filename: string): string {
    const dotIndex = filename.lastIndexOf('.')
    if (dotIndex === -1 || dotIndex === filename.length - 1) {
      return 'No file extension found'
    } else {
      return filename.substring(dotIndex + 1)
    }
  }

  const defaultActions = [
    { label: 'Save result', function: openSaveDialog },
  ]

  const srtActions = [
    { label: 'Trim timestamps', function: window.api.trimSRTFile },
  ]



  let actions: Action[] = []
  switch (getFileExtension(selectedFile.name)) {
    case 'srt':
      actions = [...defaultActions, ...srtActions]
      break
    default:
      actions = defaultActions
  }

  return (
    <>
      <div>
        {result && <button onClick={() => resultToSource(result)} >Set result as active file</button>}
        {selectedFile &&
          actions.map((action, i) => {11
            return (
              <button
                key={i}
                onClick={async () => {
                  const result: string = await action.function(selectedFile.path)
                  updateResult(result)
                }}
              >
                {action.label}
              </button>
            )
          })
        }
      </div>
    </>
  )
}

export default FileActions
