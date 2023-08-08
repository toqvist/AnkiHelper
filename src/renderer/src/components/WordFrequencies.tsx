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
            <h2>Words from source</h2>
            <div className='display-flex word-frequency'>
                <button>Sort alphabetically</button>
                <button>Sort by occurances</button>
            </div>
            {wordFreqs.map((wordFreq, i) => {
                return <div key={i} className='word-frequency'>
                    <div><a href="#" onClick={() => getSentences(wordFreq.word)}>{wordFreq.word}</a></div>
                    <div>{wordFreq.frequency}</div>
                </div>
            })}
        </>
    );
}