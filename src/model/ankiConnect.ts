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

    static async createClozeCard(deck: string, sentence: string, clozeWords: string[]): Promise<void> {
        
        if (clozeWords.length === 0) {
            console.error('Cloze words array cannot be empty.');
            return;
        }
        
        let clozeContent = sentence;
        clozeWords.forEach((word, index) => {
            const clozeIndex = index + 1;
            const hint = "..." //TODO: Get translation and use as hint
            const clozePlaceholder = `{{c${clozeIndex}::${word}::${hint}}}`;
            clozeContent = clozeContent.replace(word, clozePlaceholder);
        });

        const note = {
            deckName: deck,
            modelName: 'Cloze',
            fields: {
                Text: clozeContent,
            },
            options: {
                allowDuplicate: false,
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
            console.log('Cloze card created:', data);
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
}