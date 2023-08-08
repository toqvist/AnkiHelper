import { useFileContext } from '@renderer/contexts/FileContext';
import React, { useEffect, useState } from 'react'
import { WordFreq } from 'src/model/tools';


interface WordFrequenciesProps {
    getSentences: Function;
}

enum Sort {
    alphabeticallyDescending,
    alphabeticallyAscending,
    wordFrequencyDescending,
    wordFrequencyAscending,
}

export default function WordFrequencies({ getSentences }: WordFrequenciesProps): JSX.Element {

    const { selectedFile } = useFileContext()
    const [wordFreqs, setWordFreqs] = useState<WordFreq[]>([]);

    const [sortedBy, setSortedBy] = useState<Sort>(Sort.alphabeticallyDescending)


    useEffect(() => {
        if (wordFreqs.length == 0)
            getWordFreqs()
    }, [])

    async function getWordFreqs() {
        setWordFreqs(await window.api.wordFrequency(selectedFile))
    }

    function sortByFrequency(): void {
        let descending: boolean = true;

        if (sortedBy == Sort.wordFrequencyAscending) {
            descending = true;
            setSortedBy(Sort.wordFrequencyDescending)
        } else {
            descending = false;
            setSortedBy(Sort.wordFrequencyAscending);
        }
        const sorted: WordFreq[] = wordFreqs.sort((a, b) => {
            if (descending) {
                return b.frequency - a.frequency; // Sort in descending order
            } else {
                return a.frequency - b.frequency; // Sort in ascending order
            }
        })

        setWordFreqs(sorted);
    }

    function sortAlphabetically(): void {
        let descending: boolean = true;

        if (sortedBy == Sort.alphabeticallyAscending) {
            descending = true;
            setSortedBy(Sort.alphabeticallyDescending)
        } else {
            descending = false;
            setSortedBy(Sort.alphabeticallyAscending)
        }
        const sorted: WordFreq[] = wordFreqs.sort((a, b) => {
            if (descending) {
                return b.word.localeCompare(a.word); // Sort in descending order (reverse alphabetical)
            } else {
                return a.word.localeCompare(b.word); // Sort in ascending order (alphabetical)
            }
        })

        setWordFreqs(sorted);
    }

    return (
        <>
            <h2>Words from source</h2>
            <div className='display-flex word-frequency'>
                <button onClick={() => sortAlphabetically()}>Sort alphabetically</button>
                <button onClick={() => sortByFrequency()}>Sort by occurances</button>
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