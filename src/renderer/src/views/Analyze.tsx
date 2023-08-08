import FilePreview from '../components/FilePreview'
import FileActions from '../components/FileActions'
import { useFileContext } from '../contexts/FileContext'
import { useEffect, useState } from 'react'
import ClozeModal, { ClozeModalProps, WordObject } from '@renderer/components/ClozeModal';
import WordFrequencies from '@renderer/components/WordFrequencies';

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

export interface Language {
  name: string;
  code: string;
}

enum AnalyzeModes {
  lines, wordFrequencies
}

const languages: Language[] = [
  { name: 'English', code: 'en' },
  { name: 'Arabic', code: 'ar' },
  { name: 'Bengali', code: 'bn' },
  { name: 'Chinese (Simplified)', code: 'zh-CN' },
  { name: 'Czech', code: 'cs' },
  { name: 'Dutch', code: 'nl' },
  { name: 'French', code: 'fr' },
  { name: 'German', code: 'de' },
  { name: 'Greek', code: 'el' },
  { name: 'Hindi', code: 'hi' },
  { name: 'Italian', code: 'it' },
  { name: 'Japanese', code: 'ja' },
  { name: 'Polish', code: 'pl' },
  { name: 'Portuguese', code: 'pt' },
  { name: 'Punjabi', code: 'pa' },
  { name: 'Romanian', code: 'ro' },
  { name: 'Russian', code: 'ru' },
  { name: 'Spanish', code: 'es' },
  { name: 'Swedish', code: 'sv' },
  { name: 'Turkish', code: 'tr' },
];

function Analyze(): JSX.Element {

  const { selectedFile, srcPreview, resultPreview } = useFileContext()

  const [decks, setDecks] = useState<Deck[]>([])
  const [selectedDeck, setSelectedDeck] = useState<Deck>()

  const [leftColumn, setLeftColumn] = useState<WordFreq[] | WordObject[]>([])
  const [rightColumn, setRightColumn] = useState<Sentence[]>([])

  const [showModal, setShowModal] = useState<boolean>(false)
  const undefSent: Sentence = { words: [] }
  const [modalSentence, setModalSentence] = useState<Sentence>(undefSent)

  const [language, setLanguage] = useState<Language>(languages[0])

  const [activeMode, setActiveMode] = useState<AnalyzeModes>(AnalyzeModes.lines);

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
    setActiveMode(AnalyzeModes.wordFrequencies)
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

  function selectDeck(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedDeckName = event.target.value;
    const deck = decks.find((deck) => deck.name === selectedDeckName);
    setSelectedDeck(deck);
  };

  function closeModal() {
    setShowModal(false)
  }

  function selectLanguage(event: React.ChangeEvent<HTMLSelectElement>): void {
    const selectedLanguage = event.target.value;
    const language: Language | undefined = languages.find((lang) => lang.name === selectedLanguage);
    if (language != undefined) setLanguage(language);
  }


  return (
    <>
      {showModal &&
        <div className="modal">
          <ClozeModal
            sentence={modalSentence}
            deck={selectedDeck}
            closeModal={closeModal}
            targetLanguage={language.code}
          />
          <div onClick={() => { setShowModal(false) }} className={`modal-overlay`} />
        </div>
      }

      <div className='previews'>
        <div>
          <button onClick={() => setActiveMode(AnalyzeModes.lines)}>Source</button>
          <button onClick={() => setActiveMode(AnalyzeModes.wordFrequencies)}>Word Frequency</button>
          <h2>Words in text</h2>
          {activeMode == AnalyzeModes.wordFrequencies && <WordFrequencies getSentences={getSentences} />}
        </div>
        <div>
          <div>
            {decks.length == 0
              ? <>
                <i>No anki decks found!</i>
                <button onClick={() => getDecks()}>Retry</button>
                <div>
                  <i>Make sure anki is running with <a href="https://ankiweb.net/shared/info/2055492159">AnkiConnect</a> installed</i>
                </div>
              </>
              : <div>
                <div>
                  <span>Deck: </span>
                  <select onChange={selectDeck}>
                    {decks.map((deck) => (
                      <option value={deck.name}>{deck.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <span>Translate to: </span>
                  <select
                    id="languageSelect"
                    onChange={selectLanguage}>
                    {languages.map((language) => (
                      <option key={language.code} value={language.code}>
                        {language.name}
                      </option>
                    ))}
                  </select>
                </div>
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

export default Analyze