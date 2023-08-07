import FilePreview from '../components/FilePreview'
import FileActions from '../components/FileActions'
import { useFileContext } from '../contexts/FileContext'
import { useEffect, useState } from 'react'
import ClozeModal, { ClozeModalProps } from '@renderer/components/ClozeModal';

export interface WordFreq {
  word: string;
  frequency: number;
}

export interface Sentence {
  words: Word[]
}

export interface Word {
  text: string,
  clozed: boolean,
}

function Process(): JSX.Element {

  const { selectedFile, srcPreview, resultPreview } = useFileContext()

  const [decks, setDecks] = useState<Deck[]>([])
  const [selectedDeck, setSelectedDeck] = useState<Deck>()

  const [leftColumn, setLeftColumn] = useState<WordFreq[]>([])
  const [rightColumn, setRightColumn] = useState<Sentence[]>([])

  const [showModal, setShowModal] = useState<boolean>(false)
  const undefSent: Sentence = { words: [] }
  const [modalSentence, setModalSentence] = useState<Sentence>(undefSent)

  async function getDecks() {
    setDecks(await window.api.getDecks())
  }

  useEffect(() => {
    getDecks();

  }, []);

  useEffect(() => {
    if (decks.length > 0) {
      setSelectedDeck(decks[0]);
    }
  }, [decks]);



  async function getWordFrequency(): Promise<void> {
    const result: WordFreq[] = await window.api.wordFrequency(selectedFile)
    setLeftColumn(result);
  }

  async function getSentences(word: string): Promise<void> {
    try {
      const result: string[] = await window.api.usedInSentences(selectedFile, word);
      const sentences: Sentence[] = result.map((sent) => {
        const words: Word[] = sent.split(" ").map((text) => ({ text, clozed: false }));
        const sentence: Sentence = { words };
        return sentence;
      });
      setRightColumn(sentences);
    } catch (error) {
      console.error("Error fetching sentences:", error);
    }
  }

  async function initiateClozeCreation(sentence: Sentence) {
    setModalSentence(sentence);
    setShowModal(true);
  }

  function selectDeck (event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedDeckName = event.target.value;
    const deck = decks.find((deck) => deck.name === selectedDeckName);
    setSelectedDeck(deck);
  };

  function closeModal () {
    setShowModal(false)
  }

  return (
    <>
      {showModal &&
        <div className="modal">
          <ClozeModal sentence={modalSentence} deck={selectedDeck} closeModal={closeModal} />
          <div onClick={() => {setShowModal(false)}} className={`modal-overlay`} />
        </div>
      }

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
                <select onChange={selectDeck}>
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
                    return <span>{word.text} </span>
                  })}
                </a>
              </div>
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default Process