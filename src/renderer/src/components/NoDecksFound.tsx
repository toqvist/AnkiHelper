import { openExternalLink } from '@renderer/helpers/externalLink';
import React from 'react';

interface NoDecksFoundProps {
    getDecks: () => Promise<void>;
}


function NoDecksFound({ getDecks }: NoDecksFoundProps): JSX.Element {
    return (
        <>
            <div className='flex justify-between align-middle mb-4'>
                <p className='font-bold text-lg'>No anki decks found!</p>
                <button onClick={() => getDecks()}>Retry</button>
            </div>
            <div className='mb-4'>
                <p className='mb-4'>Make sure <a href="https://apps.ankiweb.net/" onClick={(e) => {
                    e.preventDefault();
                    openExternalLink('https://apps.ankiweb.net/');
                }}>Anki </a>
                    is running with
                    <a href="https://ankiweb.net/shared/info/2055492159" onClick={(e) => {
                        e.preventDefault();
                        openExternalLink('https://ankiweb.net/shared/info/2055492159');
                    }}> AnkiConnect</a> installed!</p>
                <p>{`Install AnkiConnect by going to Tools > Add-ons > Get Add-ons and entering the code:`} <strong>2055492159</strong></p>
            </div>
        </>
    );
}

export default NoDecksFound;



