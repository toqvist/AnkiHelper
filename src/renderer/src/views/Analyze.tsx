import { useFileContext } from '../contexts/FileContext'
import { useEffect, useState } from 'react'
import ClozeModal from '@renderer/components/ClozeModal';
import WordFrequencies from '@renderer/components/WordFrequencies';
import ClickableSentences from '@renderer/components/ClickableSentences';
import SourceAsLines from '@renderer/components/SourceAsLines';
import IntroText from '@renderer/components/IntroText';
import { openExternalLink } from '@renderer/helpers/externalLink';

export interface WordFreq {
  word: string;
  frequency: number;
}

export interface Sentence {
  words: Word[]
}

export interface Word {
  text: string;
  isPunctuation: boolean;
  clozed: boolean;
  hint: string;
  translations: string[];
}

export interface Language {
  name: string;
  code: string;
}

enum AnalyzeModes {
  lines, wordFrequencies
}

const languages: Language[] = [
  { name: 'Hint translation', code: '' },
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

  const { selectedFile } = useFileContext()

  const [decks, setDecks] = useState<Deck[]>([])
  const [selectedDeck, setSelectedDeck] = useState<Deck>()

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

  async function getSentences(word: string): Promise<void> {
    try {
      setRightColumn(await window.api.usedInSentences(selectedFile, word));
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
    if (event.target.value !== '') {
      const selectedLanguage = event.target.value;
      const language: Language | undefined = languages.find((lang) => lang.code === selectedLanguage);

      if (language !== undefined) {
        setLanguage(language);
      }
    }
  }

  return (
    <>
      {selectedFile == "" ? <IntroText />
        : <>
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

          <div className='flex gap-4 justify-between mx-4'>
            <div>
              <div className="flex gap-1 mb-3">
                <button disabled={activeMode == AnalyzeModes.lines}
                  onClick={() => setActiveMode(AnalyzeModes.lines)}
                >
                  Source</button>
                <button disabled={activeMode == AnalyzeModes.wordFrequencies}
                  onClick={() => setActiveMode(AnalyzeModes.wordFrequencies)}
                >
                  Words in text</button>
              </div>

              {selectedFile != "" && <>
                {activeMode == AnalyzeModes.lines && <>
                  <SourceAsLines onClick={initiateClozeCreation} disabled={selectedDeck !== undefined && selectedDeck.name !== ""} />
                </>}
                {activeMode == AnalyzeModes.wordFrequencies && <>
                  <WordFrequencies getSentences={getSentences} selectedDeck={selectedDeck} />
                </>}
              </>
              }
            </div>
            <div>
              <div>
                {decks.length == 0
                  ? <>
                    <div className='flex justify-between align-middle mb-4'>
                      <p className='font-bold text-lg'>No anki decks found!</p>
                      <button onClick={() => getDecks()}>Retry</button>
                    </div>

                    <div>
                      <p className='mb-4'>Make sure <a href="https://apps.ankiweb.net/" onClick={(e) => {
                        e.preventDefault();
                        openExternalLink('https://apps.ankiweb.net/');
                      }}>Anki </a>
                        is running with
                        <a href="https://ankiweb.net/shared/info/2055492159" onClick={(e) => {
                          e.preventDefault();
                          openExternalLink('https://ankiweb.net/shared/info/2055492159');
                        }}> AnkiConnect</a> installed!</p>
                      <p>{`Install AnkiConnect by going to Tools > Add-ons > Get Add-ons and entering the code:`} <strong>2055492159</strong></p>
                    </div>
                  </>
                  : <div className='flex flex-end gap-1 rounded-sm'>
                    <div>
                      <select className='bg-slate-600' onChange={selectDeck}>
                        <option value="">Deck</option>
                        {decks.map((deck) => (
                          <option key={deck.id} value={deck.name}>{deck.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <select
                        className='bg-slate-600'
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
              {rightColumn.length > 0 && <div>
                <h2>Used in sentences</h2>
                <ClickableSentences sentences={rightColumn} onClick={initiateClozeCreation} disabled={selectedDeck !== undefined && selectedDeck.name !== ""} />
              </div>}

            </div>
          </div>
        </>
      }
    </>
  )
}

export default Analyze