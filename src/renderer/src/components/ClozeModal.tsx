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

  useEffect(() => {
    async function fetchData() {
      const initialWordObjects = await getHints(sentence, targetLanguage);
      setWordObjects(initialWordObjects);
    }

    fetchData();
  }, []);


  async function getHints(sentence: Sentence, targetLanguage: string): Promise<Word[]> {
    const wordObjects: Word[] = await Promise.all(sentence.words.map(async (word) => {
      if (word.isPunctuation) {
        return word;
      }

      const translations: string[] = await window.api.translate(word.text, targetLanguage);
      if (translations[0] == word.text) {
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

    const clozedWords: string[] = [];

    wordObjects.forEach((wordObject) => {
      if (wordObject.isPunctuation) {
        return;
      }

      if (wordObject.clozed) {
        clozedWords.push(wordObject.text);
      }
    });

    if (clozedWords.length == 0) return;

    window.api.createClozeCard(deck.name, sentenceText, clozedWords).then(closeModal());
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
            <div>
              <i className="text-large">Add card to {deck.name}</i>
            </div>
            <div>
              {wordObjects.map((wordObject, i) => {
                if (!wordObject.isPunctuation) {
                  return <ClozeWord key={i} word={wordObject} updateWord={updateWord} translations={wordObject.translations} />
                } else {
                  return <span key={i} className="text-black">{wordObject.text}</span>;
                }
              })}
            </div>
            <i className="text-medium">Words marked blue will be <span className="text-clozed">[clozed]</span></i>

            <div>
              <button disabled={normalized} onClick={() => normalizeAsSentence()}>
                Normalize
              </button>
              <button disabled={noSpecials} onClick={() => removeSpecialCharacters()}>Remove special characters</button>
            </div>
            <button onClick={() => createCard()} disabled={!anyWordIsClozed()}>
              {anyWordIsClozed() ? 'Add' : 'Select at least one cloze'}
            </button>
          </div>

        }
      </div>
    </div>
  );
}