import { Sentence, Word } from "@renderer/views/Analyze"
import { KeyboardEvent, useState } from 'react'
import ClozeWord from "./ClozeWord";

export interface ClozeModalProps {
  sentence: Sentence;
  deck: Deck | undefined;
  closeModal: Function;
}


export interface WordObject {
  text: string;
  isPunctuation: boolean;
  clozed: boolean;
  hint: string
}

function ClozeModal({ sentence, deck, closeModal }: ClozeModalProps): JSX.Element {

  function sentenceToString(sentence: Sentence): string {
    return sentence.words.map((word) => word.text).join(' ');
  }

  //TODO: Merge WordObject/Word and their associated functions
  function getWordObjects(sentence: Sentence): WordObject[] {
    const sentenceText = sentenceToString(sentence);
    const wordObjects: WordObject[] = [];
    const wordPattern = /\w+/g;
    const wordsAndPunctuation = sentenceText.match(
      new RegExp(`${wordPattern.source}|\\s|[^\\w\\s]`, 'g')
    );

    if (wordsAndPunctuation) {
      wordsAndPunctuation.forEach((text) => {
        const isPunctuation = !wordPattern.test(text) && text.trim() !== '';
        wordObjects.push({ text, isPunctuation, clozed: false, hint:''});
      });
    }

    return wordObjects;
  }

  //Used for initial render of words, word components handle graphical updates themselves
  const [wordObjects, setWordObjects] = useState<WordObject[]>(getWordObjects(sentence));
  //const [outputWords, setOutputWords] = useState<WordObject[]>(getWordObjects(sentence))

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
                  return <ClozeWord word={wordObject} updateWord={updateWord} />
                } else {
                  return <span className="text-black" key={i}>{wordObject.text}</span>;
                }
              })}
            </p>
            <i className="text-medium">Words marked blue will be <span className="text-clozed">[clozed]</span></i>
            <button onClick={() => createCard()}>Add</button>
          </div>

        }
      </div>
    </div>
  );
}

export default ClozeModal