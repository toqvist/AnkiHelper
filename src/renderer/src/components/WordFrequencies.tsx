import { useFileContext } from '@renderer/contexts/FileContext';
import React, { useEffect, useState } from 'react'
import { WordFreq } from 'src/model/tools';


interface WordFrequenciesProps {
    getSentences: Function;
}

export default function WordFrequencies({ getSentences }: WordFrequenciesProps): JSX.Element {

    const { selectedFile } = useFileContext()
    const [wordFreqs, setWordFreqs] = useState<WordFreq[]>([]);

    useEffect(() => {
        if (wordFreqs.length == 0)
            getWordFreqs()
    }, [])

    async function getWordFreqs() {
        setWordFreqs(await window.api.wordFrequency(selectedFile))
    }

    return (
        <>
            {wordFreqs.map((wordFreq, i) => {
                return <div className='word-frequency'>
                    <div><a href="#" onClick={() => getSentences(wordFreq.word)}>{wordFreq.word}</a></div>
                    <div>{wordFreq.frequency}</div>
                </div>
            })}
        </>
    );
}