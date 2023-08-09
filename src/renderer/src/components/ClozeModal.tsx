import { Sentence, Word } from "@renderer/views/Analyze"
import { KeyboardEvent, useEffect, useState } from 'react'
import ClozeWord from "./ClozeWord";

export interface ClozeModalProps {
  sentence: Sentence;
  deck: Deck | undefined;
  closeModal: Function;
  targetLanguage: string;
}

export interface WordObject {
  text: string;
  isPunctuation: boolean;
  clozed: boolean;
  hint: string;
  translations: string[];
}

function ClozeModal({ sentence, deck, closeModal, targetLanguage }: ClozeModalProps): JSX.Element {


  const [wordObjects, setWordObjects] = useState<WordObject[]>([]);

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
      return { ...word, hint: translations[0], translations };
    }));

    return wordObjects;
  }

  function updateWord(word: WordObject) {
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


  return (

    <div className="modal-content">
      <div className="modal-card">
        {deck == undefined ? <p>No deck selected!</p>
          : <div className="modal-column">
            <div>
              <i className="text-large">Add card to {deck.name}</i>
            </div>
            <p>
              {wordObjects.map((wordObject, i) => {
                if (!wordObject.isPunctuation) {
                  return <ClozeWord word={wordObject} updateWord={updateWord} translations={wordObject.translations} />
                } else {
                  return <span className="text-black" key={i}>{wordObject.text}</span>;
                }
              })}
            </p>
            <i className="text-medium">Words marked blue will be <span className="text-clozed">[clozed]</span></i>

            <button onClick={() => createCard()} disabled={!anyWordIsClozed()}>
              {anyWordIsClozed() ? 'Add' : 'Select at least one cloze'}
            </button>
          </div>

        }
      </div>
    </div>
  );
}

export default ClozeModal