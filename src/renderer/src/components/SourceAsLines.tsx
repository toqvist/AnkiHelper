import { useFileContext } from '@renderer/contexts/FileContext';
import React, { useEffect, useState } from 'react'
import { WordFreq } from 'src/model/tools';
import ClickableSentences from './ClickableSentences';
import { Sentence } from '@renderer/views/Analyze';

interface SourceAsLinesProps {
    onClick: Function
}

export default function SourceAsLines({ onClick }: SourceAsLinesProps): JSX.Element {

    const { selectedFile } = useFileContext()
    const [sentences, setSentences] = useState<Sentence[]>([]);

    useEffect(() => {
        if (sentences.length == 0)
            getSentences()
    }, [])

    async function getSentences() {
        setSentences(await window.api.readFileAsSentences(selectedFile, Infinity))
    }

    return (
        <>
            <h2>Source content</h2>
            {sentences.length > 0 &&
                <ClickableSentences sentences={sentences} onClick={onClick} />
            }
        </>
    );
}