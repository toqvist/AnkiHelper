import FilePreview from '../components/FilePreview'
import FileActions from '../components/FileActions'
import { useFileContext } from '../contexts/FileContext'
import { useState } from 'react'
import IntroText from '@renderer/components/IntroText'

function Process(): JSX.Element {

    const { selectedFile, srcPreview, resultPreview } = useFileContext()

    return (
        <>
            {selectedFile == "" ? <IntroText />
                : <div>
                    <FileActions />
                    {selectedFile && (
                        <div className="previews">
                            <div>
                                <h2>Source</h2>
                                <FilePreview previewLines={srcPreview} />
                            </div>
                            <div>
                                <h2>Result</h2>
                                <FilePreview previewLines={resultPreview} />
                            </div>
                        </div>
                    )}
                </div>}
        </>
    )
}

export default Process
