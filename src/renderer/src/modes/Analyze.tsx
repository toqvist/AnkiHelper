import FilePreview from '../components/FilePreview'
import FileActions from '../components/FileActions'
import { useFileContext } from '../contexts/FileContext'
import { useState } from 'react'

function Process(): JSX.Element {

  const { selectedFile, srcPreview, resultPreview } = useFileContext()

  return (
    <div className='previews'>
      <div><h2>Words in text</h2>
        <p>Words should be clickable</p>
        <p>Clicking word brings up all sentences that uses that word on the right</p>
      </div>
      <div><h2>Used in sentences</h2>
      
      <div className="sentence"><p>I am an example <strong>sentence</strong></p><button>Cloze</button></div>
      </div>
    </div>
  )
}

export default Process