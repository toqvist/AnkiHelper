import FilePreview from '../components/FilePreview'
import FileActions from '../components/FileActions'
import { useFileContext } from '../contexts/FileContext'
import { useState } from 'react'

function Process(): JSX.Element {

    const { selectedFile, srcPreview, resultPreview } = useFileContext()

    return (
        <div>
          <p>Load the entire file here</p>
          <p>In the future it should probably be paginated</p>
        </div>
    )
}

export default Process
