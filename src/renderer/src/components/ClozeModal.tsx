import { Sentence, Word } from "@renderer/views/Analyze"
import { useState } from 'react'

export interface ClozeModalProps {
  sentence: Sentence;
  deck: Deck | undefined;
}


interface WordObject {
  text: string;
  isPunctuation: boolean;
  clozed: boolean;
}

function ClozeModal({ sentence, deck }: ClozeModalProps): JSX.Element {

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
        wordObjects.push({ text, isPunctuation, clozed: false });
      });
    }

    return wordObjects;
  }

  const [wordObjects, setWordObjects] = useState<WordObject[]>(getWordObjects(sentence));

  function toggleClozed(wordObjectToToggle: WordObject) {
    setWordObjects((prevWordObjects) =>
      prevWordObjects.map((wordObject) => {
        if (wordObject === wordObjectToToggle) {
          return { ...wordObject, clozed: !wordObject.clozed };
        } else {
          return wordObject;
        }
      })
    );
  }

  function createCard(): void {
    // Create a sentence out of the wordObjects array
    const sentenceText = wordObjects.reduce((acc, wordObject) => {
      if (!wordObject.isPunctuation) {
        return acc + wordObject.text + ' ';
      }
      return acc + wordObject.text;
    }, '');

    const trimmedSentence = sentenceText.trim();
    console.log(trimmedSentence);

    // Create an array to hold the clozed words
    const clozedWords: string[] = [];

    // Check each wordObject for clozed set to true
    wordObjects.forEach((wordObject) => {
      if (wordObject.isPunctuation) {
        // Skip punctuation
        return;
      }

      if (wordObject.clozed) {
        // If the word is clozed, add it to the clozedWords array
        clozedWords.push(wordObject.text);
      }
    });

    console.log(clozedWords);

    // Now you can use the trimmedSentence and clozedWords as needed.
    // Example: window.api.createClozeCard(deck, trimmedSentence, clozedWords);
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
                  return (
                    <a
                      key={i}
                      className={wordObject.clozed ? 'text-clozed' : 'text-black'}
                      href="#"
                      onClick={() => toggleClozed(wordObject)}
                    >
                      {wordObject.text}
                    </a>
                  );
                } else {
                  return <span key={i}>{wordObject.text}</span>;
                }
              })}
            </p>
            <i className="text-medium">Words marked blue will be <span className="text-clozed">[clozed]</span></i>            <button onClick={() => createCard()}>Add</button>
          </div>
        }

      </div>
    </div>
  );
}

export default ClozeModal