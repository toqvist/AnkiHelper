import React from 'react';

interface DeckSelectionProps {
    decks: Deck[];
    selectedDeck?: Deck;
    selectDeck: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}


function DeckSelection({
    decks,
    selectedDeck,
    selectDeck,
}: DeckSelectionProps): JSX.Element {
    return (
        <div>
            <select className='bg-slate-600' onChange={selectDeck}>
                <option value="">Deck</option>
                {decks.map((deck) => (
                    <option key={deck.id} value={deck.name}>
                        {deck.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default DeckSelection;
