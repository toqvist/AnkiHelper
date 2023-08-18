import { useFileContext } from '../contexts/FileContext'
import { ChangeEvent, useEffect, useState } from 'react'
import ClozeModal from '@renderer/components/ClozeModal';
import WordFrequencies from '@renderer/components/WordFrequencies';
import ClickableSentences from '@renderer/components/ClickableSentences';
import SourceAsLines from '@renderer/components/SourceAsLines';
import IntroText from '@renderer/components/IntroText';
import { openExternalLink } from '@renderer/helpers/externalLink';
import NoDecksFound from '@renderer/components/NoDecksFound';
import DeckSelection from '@renderer/components/DeckSelection';
import LanguageSelection from '@renderer/components/LanguageSelection';

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
      setRightColumn(await window.api.usedInSentences(selectedFile.path, word));
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

  if (selectedFile.path == "") return <IntroText />

  return (
    <>
      {showModal &&
        <ClozeModal
          sentence={modalSentence}
          deck={selectedDeck}
          closeModal={closeModal}
          targetLanguage={language.code}
        />
      }

      <div className='mx-auto' />

      <div className='flex justify-center'>
        <div className='grid gap-4 grid-cols-2 w-lg'>
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
            {selectedFile.path != "" && <>
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
                ? <NoDecksFound getDecks={getDecks} />
                : <>
                  <div className='flex flex-end gap-1 rounded-sm'>
                    <DeckSelection decks={decks}
                      selectedDeck={selectedDeck}
                      selectDeck={selectDeck} />
                    <LanguageSelection
                      languages={languages}
                      selectLanguage={selectLanguage}
                      language={language} />
                  </div>
                </>
              }
            </div>
            {rightColumn.length > 0 && <div>
              <h2 className='mb-2'>Used in sentences</h2>
              <ClickableSentences sentences={rightColumn} onClick={initiateClozeCreation} disabled={selectedDeck !== undefined && selectedDeck.name !== ""} />
            </div>}
          </div>
        </div>
      </div>
      <div className='mx-auto' />

    </>
  )
}

export default Analyze