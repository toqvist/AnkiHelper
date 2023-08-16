import { useFileContext } from '@renderer/contexts/FileContext';
import { useEffect, useState } from 'react'
import { WordFreq } from 'src/model/tools';
import pLimit from 'p-limit';
import Spinner from './Spinner';


interface WordFrequenciesProps {
    getSentences: Function;
    selectedDeck: Deck | undefined;
}

enum Sort {
    alphabeticallyDescending,
    alphabeticallyAscending,
    wordFrequencyDescending,
    wordFrequencyAscending,
}

export default function WordFrequencies({ getSentences, selectedDeck }: WordFrequenciesProps): JSX.Element {

    const [isLoading, setIsLoading] = useState<boolean>(true)

    const { selectedFile } = useFileContext()
    const [wordFreqs, setWordFreqs] = useState<WordFreq[]>([]);

    const [sortedBy, setSortedBy] = useState<Sort>(Sort.alphabeticallyDescending)


    useEffect(() => {
        if (wordFreqs.length == 0)
            getWordFreqs()
    }, [])

    async function getWordFreqs() {
        setWordFreqs(await window.api.wordFrequency(selectedFile))
        setIsLoading(false)
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
                return b.frequency - a.frequency;
            } else {
                return a.frequency - b.frequency;
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
                return b.word.localeCompare(a.word);
            } else {
                return a.word.localeCompare(b.word);
            }
        })

        setWordFreqs(sorted);
    }

    async function getNewWords(): Promise<void> {
        if (selectedDeck === undefined) return;
        setIsLoading(true)

        const newWords: WordFreq[] = [];
        const limit = pLimit(5);
        console.log("fetching new words")
        await Promise.all(
            wordFreqs.map(async (wordFreq) => {
                await limit(async () => {
                    if (await window.api.isWordNew(wordFreq.word, selectedDeck.name)) {
                        newWords.push(wordFreq);
                    }
                });
            })
        );
        console.log(newWords)
        setWordFreqs(newWords);
        setIsLoading(false)
    }

    return (
        <>
            <h2>Words from source</h2>
            <button disabled={selectedDeck === undefined || selectedDeck.name === ""} onClick={() => getNewWords()}>New words</button>
            <div className='flex flex-col'>

                {
                    (wordFreqs.length == 0 || isLoading) &&
                    <div className='display-flex justify-center word-frequency'>
                        <Spinner />
                    </div>
                }
                {isLoading == false &&
                    <div className='grid grid-cols-2'>
                        <button
                            className='rounded-none'
                            onClick={() => sortAlphabetically()}>
                            A-Z
                            {sortedBy === Sort.alphabeticallyAscending ? ' ▲' : sortedBy === Sort.alphabeticallyDescending ? ' ▼' : ''}
                        </button>
                        <button
                            className='rounded-none'
                            onClick={() => sortByFrequency()}>
                            #
                            {sortedBy === Sort.wordFrequencyAscending ? ' ▲' : sortedBy === Sort.wordFrequencyDescending ? ' ▼' : ''}
                        </button>
                        {wordFreqs.map((wordFreq, i) => {
                            return <>
                                <div><a href="#" onClick={() => getSentences(wordFreq.word)}>{wordFreq.word}</a></div>
                                <div className='text-center'>{wordFreq.frequency}</div>
                            </>
                        })}
                    </div>
                }
            </div>
        </>
    );
}