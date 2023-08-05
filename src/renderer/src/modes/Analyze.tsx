import FilePreview from '../components/FilePreview'
import FileActions from '../components/FileActions'
import { useFileContext } from '../contexts/FileContext'
import { useEffect, useState } from 'react'


function Process(): JSX.Element {

  //const { selectedFile, srcPreview, resultPreview } = useFileContext()

  //  const decks: Deck[] = []

  const [decks, setDecks] = useState<Deck[]>([])

  async function getDecks() {
    setDecks(await window.api.getDecks())
  }

  useEffect(() => {
    getDecks();
  }, []);

  return (
    <div className='previews'>
      <div><h2>Words in text</h2>
        <p>Words should be clickable</p>
        <p>Clicking word brings up all sentences that uses that word on the right</p>
      </div>
      <div>
        <div>
          {/* TODO: Force user to pick a deck if they want to add a cloze, i.e. disable cloze button if no deck is picked*/}
          <span>Deck: </span> 
          {decks.length == 0
            ? <>
              <i>No anki decks found</i>
              <button onClick={() => getDecks()}>Retry</button>
              <div>
                <p>Make sure anki is running with <a href="https://ankiweb.net/shared/info/2055492159">AnkiConnect</a> active</p>
              </div>
            </>
            : <select>
              {decks.map((deck) => (
                <option value={deck.name}>{deck.name}</option>
              ))}
            </select>
          }
        </div>
        <h2>Used in sentences</h2>
        <div className="sentence"><p>I am an example <strong>sentence</strong></p><button>Cloze</button></div>
      </div>
    </div>
  )
}

export default Process