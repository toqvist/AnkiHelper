import { Word } from '@renderer/views/Analyze';
import fetch from 'cross-fetch'

export interface Deck {
    name: string;
    id: number;
}

const apiURL = 'http://127.0.0.1:8765';

export class AnkiConnect {

    static async getDecks(): Promise<Deck[]> {
        try {
            const body = JSON.stringify({ action: "deckNamesAndIds", version: 6 });

            const response = await fetch(apiURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body,
            });

            const resultObject = await response.json();
            const resultDecks = resultObject.result

            const decks: Deck[] = Object.entries(resultDecks).map(([name, id]) => ({
                name: name as string,
                id: id as number,
            }));

            const returnDecks: Deck[] = decks.filter(deck => deck.name !== 'Default');

            return returnDecks;
        } catch (error) {
            console.error('Error fetching decks:', error);
            return [];
        }
    }

    static async createClozeCard(deck: string, words: Word[]): Promise<void> {

        let clozeIndex: number = 1;
        const wordArr: string[] = words.map((word) => {
            if(word.clozed) {
                clozeIndex++;
                return `{{c${clozeIndex}::${word.text}::${word.hint}}}`
            }
            else {
                return word.text
            }
        })

        let noteContent: string = wordArr.join('');

        const note = {
            deckName: deck,
            modelName: 'Cloze',
            fields: {
                Text: noteContent,
            },
            options: {
                allowDuplicate: true,
            },
            tags: ['cloze'],
        };

        const request = {
            action: 'addNote',
            version: 6,
            params: {
                note,
            },
        };

        try {
            const response = await fetch(apiURL, {
                method: 'POST',
                body: JSON.stringify(request),
            });

            const data = await response.json();
            /* console.log('Cloze card created:', data); */
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    static async createBasicCard(deck: string, front: string, back: string): Promise<void> {

        const defaultNote = {
            note: {
                deckName: deck,
                modelName: "Basic",
                fields: {
                    Front: front,
                    Back: back,
                },
                options: {
                    allowDuplicate: false,
                    duplicateScope: "deck",
                    duplicateScopeOptions: {
                        deckName: "Default",
                        checkChildren: false,
                        checkAllModels: false,
                    },
                },
                tags: ["basic"],
            },
        };
    }

    static async isWordNew(word: string, deckName: string): Promise<boolean> {
        try {
            const requestData = {
                action: 'findNotes',
                version: 6,
                params: {
                    query: `deck:${deckName} nc:${word}`,
                },
            };

            const response = await fetch(apiURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();

            return data.result.length > 0;
        } catch (error) {
            console.error(`Error checking word "${word}" in Anki deck:`, error);
            return false;
        }
    }
}