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
                    <i>The processor can automatically process files. Currently removing SRT timestamps is the only option. Try opening movie subitles!</i>
                    {selectedFile && (
                        <div className="flex justify-between mx-6">
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
