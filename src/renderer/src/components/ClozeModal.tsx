import { Sentence, Word } from "@renderer/views/Analyze"
import { useEffect, useState } from 'react'
import ClozeWord from "./ClozeWord";

export interface ClozeModalProps {
  sentence: Sentence;
  deck: Deck | undefined;
  closeModal: Function;
  targetLanguage: string;
}

export default function ClozeModal({ sentence, deck, closeModal, targetLanguage }: ClozeModalProps): JSX.Element {

  const [wordObjects, setWordObjects] = useState<Word[]>([]);

  const [normalized, setNormalized] = useState<boolean>(false);
  const [noSpecials, setNoSpecials] = useState<boolean>(false);

  const [optionsHidden, setOptionsHidden] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      const initialWordObjects = await getHints(sentence, targetLanguage);
      setWordObjects(initialWordObjects);
    }

    fetchData();
  }, []);


  async function getHints(sentence: Sentence, targetLanguage: string): Promise<Word[]> {

    if (targetLanguage === '') {
      const words: Word[] = sentence.words.map((word) => {
        return word;
      })
      return words;
    }

    const wordObjects: Word[] = await Promise.all(sentence.words.map(async (word) => {
      if (word.isPunctuation) {
        return word;
      }

      const translations: string[] = await window.api.translate(word.text, targetLanguage);
      if (translations[0] === word.text) {
        return { ...word, hint: '', translations: [] };
      } else {
        return { ...word, hint: translations[0], translations };
      }

    }));

    return wordObjects;
  }


  function updateWord(word: Word) {
    setWordObjects((prevWordObjects) =>
      prevWordObjects.map((wordObject, i) => {
        if (wordObject.text === word.text) {
          return word;
        } else {
          return wordObject;
        }
      })
    );
  }

  function anyWordIsClozed(): boolean {
    for (const word of wordObjects) {
      if (word.clozed === true) {
        return true;
      }
    }
    return false;
  }

  function createCard(): void {

    if (deck == undefined) return

    let sentenceText = '';

    wordObjects.forEach((wordObject, index) => {
      const isFirstWord = index === 0;
      const previousWasPunctuation = index > 0 && wordObjects[index - 1].isPunctuation;

      if (!wordObject.isPunctuation) {
        if (!isFirstWord && !previousWasPunctuation) {
          sentenceText += ' ';
        }
        sentenceText += wordObject.text;
      } else {
        sentenceText += wordObject.text;
      }
    });

    if (wordObjects.length == 0) return;

    window.api.createClozeCard(deck.name, wordObjects).then(closeModal());
  }


  function normalizeAsSentence(): void {
    if (wordObjects.length === 0) {
      return;
    }

    let normalizedSentence: Word[] = [...wordObjects];

    const newFirstWord = { ...wordObjects[0] };
    newFirstWord.text = newFirstWord.text.charAt(0).toUpperCase() + newFirstWord.text.slice(1);
    normalizedSentence[0] = newFirstWord;

    const lastWord: Word = wordObjects[wordObjects.length - 1]

    if (lastWord.isPunctuation) {
      normalizedSentence.pop()
      normalizedSentence.push({ ...lastWord, text: '.' })
    }

    setWordObjects(normalizedSentence);
    setNormalized(true);
  }

  function removeSpecialCharacters() {

    const validCharacters = ['.', ',', '?', '!', ' '];
    const validWords = wordObjects.filter(word => {
      if (word.isPunctuation) {
        return validCharacters.includes(word.text);
      } else {
        return /^[a-zA-Z ]*$/.test(word.text);
      }
    });

    setWordObjects(validWords);
    setNoSpecials(true);
  }


  return (

    <div className="modal-content">
      <div className="modal-card">
        {deck == undefined ? <p>No deck selected!</p>
          : <div className="modal-column">
            <div className="flex flex-col items-center">
              <h1 className="text-lg text-slate-950 font-semibold">Add card to {deck.name}</h1>
              <p className="text-sm text-slate-950">Words marked blue will be <span className="text-clozed">[clozed]</span></p>
            </div>

            <div>
              {wordObjects.map((wordObject, i) => {
                if (!wordObject.isPunctuation) {
                  return <ClozeWord key={i} word={wordObject} updateWord={updateWord} translations={wordObject.translations} />
                } else {
                  return <span key={i} className="text-slate-950 text-3xl">{wordObject.text}</span>;
                }
              })}
            </div>

            <div className="flex gap-1">
              <div className="relative">
                <button className="bg-slate-200 border-slate-200 border-2 text-slate-950 px-2 py-2 rounded-md text-sm hover:bg-slate-300 hover:border-slate-300"
                  onClick={() => setOptionsHidden(!optionsHidden)}>
                  Options ▼
                </button>

                <div className={`absolute z-10 right-0 mt-2 py-2 w-32 bg-slate-200 border-slate-300 rounded-md shadow ${optionsHidden ? 'hidden' : ''}`}>
                  <button
                    className="block w-full text-left px-4 py-2 text-slate-950 bg-slate-200 border-slate-300 hover:bg-slate-100 disabled:bg-gray-300 disabled:cursor-not-allowed  text-xs"
                    disabled={normalized}
                    onClick={() => normalizeAsSentence()}
                  >
                    Normalize
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-slate-950 bg-slate-200 border-slate-300 hover:bg-slate-100 disabled:bg-gray-300 disabled:cursor-not-allowed  text-xs"
                    disabled={noSpecials}
                    onClick={() => removeSpecialCharacters()}
                  >
                    Remove special characters
                  </button>
                </div>
              </div>
              <button className='text-slate-950 bg-slate-200 border-2 rounded-md text-sm hover:bg-slate-300 hover:border-slate-300' onClick={() => createCard()} disabled={!anyWordIsClozed()}>
                {anyWordIsClozed() ? 'Create card' : 'Select at least one cloze'}
              </button>
            </div>
          </div>

        }
      </div>
    </div>
  );
}