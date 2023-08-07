import { Sentence, Word } from "@renderer/views/Analyze"
import { useState } from 'react'

export interface ClozeModalProps {
  sentence: Sentence
}


interface WordObject {
  text: string;
  isPunctuation: boolean;
  clozed: boolean;
}

function ClozeModal({ sentence }: ClozeModalProps): JSX.Element {
  
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

  return (
    <div className="modal-content">
      <div className="modal-card">
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
        <button>Add</button>
        <i></i>
      </div>
    </div>
  );
}

export default ClozeModal