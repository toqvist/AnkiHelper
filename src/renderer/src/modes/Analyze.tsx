import FilePreview from '../components/FilePreview'
import FileActions from '../components/FileActions'
import { useFileContext } from '../contexts/FileContext'
import { useState } from 'react'


function Process(): JSX.Element {

  //const { selectedFile, srcPreview, resultPreview } = useFileContext()

  //  const decks: Deck[] = []

  const [decks, setDecks] = useState<Deck[]>([])

  async function getDecks () {
    console.log("get decks")
    console.log(await window.api.getDecks())
    setDecks(await window.api.getDecks())  
  }

  return (
    <div className='previews'>
      <div><h2>Words in text</h2>
        <p>Words should be clickable</p>
        <p>Clicking word brings up all sentences that uses that word on the right</p>
      </div>
      <div>
        <button onClick={() => getDecks()}>get decks</button>
        {decks.length == 0
          ? <i>No anki decks found</i>
          : <select>
            {decks.map((deck) => (
              <option value={deck.name}>{deck.name}</option>
            ))}
          </select>
        }
        <h2>Used in sentences</h2>
        <div className="sentence"><p>I am an example <strong>sentence</strong></p><button>Cloze</button></div>
      </div>
    </div>
  )
}

export default Process