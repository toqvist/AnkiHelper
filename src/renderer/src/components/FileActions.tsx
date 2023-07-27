import { useState } from 'react'
import { useFileContext } from '../contexts/FileContext'
import FilePreview from './FilePreview'

interface Action {
  label: string
  function: Function
}

// TODO: Move actions to context or other

function FileActions(): JSX.Element {
  /* const [actions, setActions] = useState<Action[]>([]); */
  const { selectedFile, updateResult, openSaveDialog } = useFileContext()

  function getFileExtension(filename: string): string {
    const dotIndex = filename.lastIndexOf('.')
    if (dotIndex === -1 || dotIndex === filename.length - 1) {
      return 'No file extension found'
    } else {
      return filename.substring(dotIndex + 1)
    }
  }

  const defaultActions = [
    { label: 'Save', function: openSaveDialog }
  ]

  const srtActions = [
    { label: 'Trim timestamps', function: window.api.trimSRTFile },
  ]



  let actions: Action[] = []
  switch (getFileExtension(selectedFile)) {
    case 'srt':
      actions = [ ...defaultActions, ...srtActions ]
      break
    default:
      actions = defaultActions
  }

  return (
    <>
      <div>
       { selectedFile &&
          actions.map((action, i) => {
            return (
              <button
                onClick={async () => {
                  const result: string = await action.function(selectedFile)
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
