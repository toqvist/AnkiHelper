import FilePreview from '../components/FilePreview'
import FileActions from '../components/FileActions'
import { useFileContext } from '../contexts/FileContext'
import { useEffect, useState } from 'react'

export interface WordFreq {
  word: string;
  frequency: number;
}

interface Sentence {
  words: string[]
}

interface Word {
  text: string,
}

function Process(): JSX.Element {

  const { selectedFile, srcPreview, resultPreview } = useFileContext()

  //  const decks: Deck[] = []

  const [decks, setDecks] = useState<Deck[]>([])
  const [leftColumn, setLeftColumn] = useState<WordFreq[]>([])
  const [rightColumn, setRightColumn] = useState<Sentence[]>([])

  async function getDecks() {
    setDecks(await window.api.getDecks())
  }

  useEffect(() => {
    getDecks();
  }, []);


  async function getWordFrequency() : Promise<void> {
    const result: WordFreq[] = await window.api.wordFrequency(selectedFile)
    setLeftColumn(result);
  }

  async function getSentences(word: string): Promise<void> {
    console.log(await window.api.usedInSentences(selectedFile, word))
    const result: string[] = await window.api.usedInSentences(selectedFile, word);
    const sentences: Sentence[] = result.map((sent, i) => {
      const sentence: Sentence = { words: sent.split(" ") };
      return sentence;
    });
    setRightColumn(sentences);
  }

  async function initiateClozeCreation(sentence: Sentence) {
    
  }

  return (
    <div className='previews'>

      <div>
        <button onClick={() => getWordFrequency()}>Word Frequency</button>
        <h2>Words in text</h2>
        {leftColumn?.map((wordFreq, i) => {
          return <div className='word-frequency'>
            <div><a href="#" onClick={() => getSentences(wordFreq.word)}>{wordFreq.word}</a></div>
            <div>{wordFreq.frequency}</div>
          </div>
        })}
      </div>
      <div>
        <div>
          {/* TODO: Force user to pick a deck if they want to add a cloze, i.e. disable cloze button if no deck is picked*/}
          {decks.length == 0
            ? <>
              <i>No anki decks found!</i>
              <button onClick={() => getDecks()}>Retry</button>
              <div>
                <i>Make sure anki is running with <a href="https://ankiweb.net/shared/info/2055492159">AnkiConnect</a> installed</i>
              </div>
            </>
            : <div>
              <span>Deck: </span>
              <select>
                {decks.map((deck) => (
                  <option value={deck.name}>{deck.name}</option>
                ))}
                </select>
            </div>
          }
        </div>
        <h2>Used in sentences</h2>
        <div>
          {rightColumn?.map((sentence, i) => {
            return <div className="sentence">
              <a href="#" onClick={() => initiateClozeCreation(sentence)}>
                {" • "}
                {sentence.words.map((word, i) => {
                  return <span>{word} </span>
                })}
              </a>
            </div>
          })}
        </div>
      </div>
    </div>
  )
}

export default Process